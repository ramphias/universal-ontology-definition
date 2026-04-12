import { NextAuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getUserRole, type Role } from "./permissions";

// Extend the built-in session types to include our custom Role and GitHub tokens
declare module "next-auth" {
    interface Session {
        user: {
            login: string;
            role: Role;
        } & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            // Downgraded scope: we only need to verify identity, not read/write all their repos
            authorization: { params: { scope: "read:user user:email" } }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ profile }) {
            const githubLogin = (profile as any)?.login;
            if (!githubLogin) return false;

            // Optional: Immediately bounce unauthorized users right at the GitHub prompt
            // But we can let them log in and block them at the layout level instead. 
            // Blocking them here means they stay on the signin page with an "Access Denied" error overlay.
            // Let's block them here to be perfectly secure.
            const role = await getUserRole(githubUsername(githubLogin));
            if (!role) {
                // Return a URL to a custom "Access Denied" page, or just false to use default error
                return false; 
            }
            return true;
        },
        async jwt({ token, account, profile }) {
            // We strictly DO NOT persist the OAuth access_token into our JWT to minimize risk
            if (profile) {
                token.login = (profile as any).login;
            }
            
            // Re-fetch role dynamically from blobs so it updates if Admin changes their role while logged in (optional cache hit)
            if (token.login) {
                token.role = await getUserRole(token.login as string);
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

function githubUsername(loginOrProfile: any): string {
    if (typeof loginOrProfile === 'string') return loginOrProfile;
    return loginOrProfile?.login || '';
}
