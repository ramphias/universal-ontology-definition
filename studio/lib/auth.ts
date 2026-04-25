import { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getUserRoleRecord, type Role } from "./permissions";

/**
 * Subset of the GitHub OAuth profile we actually use. NextAuth types `profile`
 * as `Profile | undefined` — too loose for callbacks that need `login`.
 */
type GithubProfile = {
    login?: string;
    id?: number;
    name?: string;
    email?: string;
};

// Extend the built-in session types to include our custom Role and GitHub tokens
declare module "next-auth" {
    interface Session {
        user: {
            login: string;
            role: Role;
        } & DefaultSession["user"];
    }
}

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
        throw new Error(
            `Missing required environment variable: ${name}. ` +
            `Studio cannot start without auth/session secrets configured.`
        );
    }
    return value;
}

// Fail fast at module load if any required secret is missing — preferable to
// running with a silently-undefined value that yields cryptic 500s mid-flow.
const GITHUB_ID = requireEnv("GITHUB_ID");
const GITHUB_SECRET = requireEnv("GITHUB_SECRET");
const NEXTAUTH_SECRET = requireEnv("NEXTAUTH_SECRET");

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
            // Read-only scopes: identity + email only. We deliberately do NOT request
            // public_repo — server-side writes (PR creation for approved edits) must
            // go through a server-side credential (GitHub App / fine-grained PAT),
            // not a user OAuth token, so a leaked session cookie can never write.
            authorization: { params: { scope: "read:user user:email" } }
        }),
    ],
    secret: NEXTAUTH_SECRET,
    // Short-lived sessions: the JWT expires after 5 minutes of inactivity, and
    // gets re-issued every 60 s while the user is active so role/roleVersion
    // changes propagate quickly. A revoked admin loses access on the next
    // refresh — at most ~60 s after the revocation, never more than 5 min.
    session: {
        strategy: "jwt",
        maxAge: 5 * 60,
        updateAge: 60,
    },
    callbacks: {
        async signIn({ profile }) {
            const githubLogin = (profile as GithubProfile | undefined)?.login;
            if (!githubLogin) return false;

            // Block unauthorized users at the GitHub prompt rather than after
            // a full sign-in cycle.
            const record = await getUserRoleRecord(githubUsername(githubLogin));
            if (!record) {
                return false;
            }
            return true;
        },
        async jwt({ token, account, profile }) {
            // Persist OAuth access_token in the JWT (server-side, encrypted) so admins
            // can commit approved edits as themselves. It's NEVER forwarded to the client session.
            if (account?.access_token) {
                token.accessToken = account.access_token;
            }
            if (profile) {
                token.login = (profile as GithubProfile).login;
            }

            // Re-fetch role + version on every refresh. If the persisted version
            // moved past what's in the token, the user's permissions changed
            // since this session was issued — drop the role on the token so
            // they're treated as unauthenticated until they sign in again.
            if (token.login) {
                const record = await getUserRoleRecord(token.login as string);
                if (!record) {
                    token.role = null;
                    token.roleVersion = undefined;
                } else if (
                    typeof token.roleVersion === "number" &&
                    token.roleVersion !== record.version
                ) {
                    token.role = null;
                    token.roleVersion = record.version;
                } else {
                    token.role = record.role;
                    token.roleVersion = record.version;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like the user role, but NEVER the access token!
            if (session.user && token.login && token.role) {
                session.user.login = token.login as string;
                session.user.role = token.role as Role;
            }
            return session;
        }
    },
    pages: {
        // We'll create custom signin pages later, falling back to default for now
    }
};

function githubUsername(loginOrProfile: string | GithubProfile | undefined): string {
    if (typeof loginOrProfile === "string") return loginOrProfile;
    return loginOrProfile?.login || "";
}

/**
 * Retrieve the current user's GitHub OAuth access token from the JWT.
 * Only callable server-side. Returns null if the user is not authenticated
 * or their token hasn't been captured (e.g. signed in before scope expansion).
 */
export async function getUserAccessToken(): Promise<string | null> {
    const { getToken } = await import("next-auth/jwt");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const req = {
        cookies: Object.fromEntries(cookieStore.getAll().map(c => [c.name, c.value])),
        headers: { cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ") },
    } as any;
    const token = await getToken({ req, secret: NEXTAUTH_SECRET });
    return (token?.accessToken as string) || null;
}
