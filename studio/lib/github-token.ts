import { getUserAccessToken } from "./auth";

/**
 * Pick a GitHub token for the current request:
 *  - Prefer the signed-in user's OAuth token (so their per-account rate limit
 *    applies and we get a real audit trail).
 *  - Fall back to the server-side `GITHUB_TOKEN` so anonymous visitors can
 *    still read public ontology files. **`GITHUB_TOKEN` MUST be a read-only
 *    PAT (e.g. fine-grained, public-repo read only)** — anything broader
 *    re-introduces the single-point-of-write risk we removed in Phase 0.4.
 *  - Returns `undefined` if neither is set; callers should still send the
 *    request and let GitHub apply its anonymous 60/hr rate limit.
 *
 * `getUserAccessToken()` requires NEXTAUTH_SECRET; in build / dev contexts
 * where it isn't set we swallow the error and treat the caller as anonymous.
 */
export async function pickGithubToken(): Promise<string | undefined> {
    let userToken: string | null = null;
    try {
        userToken = await getUserAccessToken();
    } catch {
        // build-time, no session, or missing NEXTAUTH_SECRET — treat as anon
    }
    return userToken ?? process.env.GITHUB_TOKEN ?? undefined;
}
