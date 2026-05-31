/**
 * Mint a short-lived HS256 JWS that authenticates the current Studio
 * session against `uod-backend`. The backend verifies the same signature
 * using its copy of `NEXTAUTH_SECRET` (shared with Studio via Fly secrets).
 *
 * This is intentionally a server-side helper, NOT a `"use server"` action:
 * client components must never call it — the token would leak. Use it
 * only from Server Components or `lib/backend.ts`.
 *
 * Why HS256 JWS instead of NextAuth's JWE?
 *   NextAuth ships an encrypted (JWE / A256GCM) cookie. Decrypting that
 *   format inside Python adds ~100 lines + tests; we punted to Phase A.3
 *   PR-3. Until then the backend trusts a 60-second HS256 token minted
 *   here, which is just as strong cryptographically — the secret never
 *   leaves the server.
 */
import crypto from "node:crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const TOKEN_TTL_SECONDS = 60;

function base64url(input: Buffer | string): string {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf-8");
    return buf
        .toString("base64")
        .replace(/=+$/, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}

export type MintedToken = {
    token: string;
    login: string;
    role: "viewer" | "editor" | "admin";
};

/**
 * Returns a token for the calling user, or null if there's no valid session.
 *
 * The caller MUST handle the null case — null means "unauthenticated", not
 * "error". Errors throw.
 */
export async function mintBackendToken(): Promise<MintedToken | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.login || !session.user.role) return null;

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret || secret.trim().length === 0) {
        throw new Error(
            "NEXTAUTH_SECRET is not configured. " +
                "Studio cannot authenticate against uod-backend without it."
        );
    }

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
        login: session.user.login,
        role: session.user.role,
        iat: now,
        exp: now + TOKEN_TTL_SECONDS,
    };

    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(payload));
    const signingInput = `${headerB64}.${payloadB64}`;
    const signature = crypto
        .createHmac("sha256", secret)
        .update(signingInput)
        .digest();

    return {
        token: `${signingInput}.${base64url(signature)}`,
        login: session.user.login,
        role: session.user.role,
    };
}
