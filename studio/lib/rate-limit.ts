import { getStore } from "@netlify/blobs";

/**
 * Fixed-window rate limiter, persisted in Netlify Blobs so the limit is
 * enforced across serverless instances (in-memory state would reset on cold
 * starts and not bind across regions). The window is 60 s; every user gets
 * `RATE_LIMIT_PER_MINUTE` actions per (action-name, minute) bucket.
 *
 * Trade-off: blob get + set per call adds ~2 round-trips of overhead. That's
 * acceptable for admin endpoints. There's also a small race window (two
 * concurrent calls can both write `count: N+1`); for an order-of-magnitude
 * limit that's fine — if you need exact correctness move to a CAS-aware
 * store like Upstash Redis.
 */

export const RATE_LIMIT_PER_MINUTE = 10;
const WINDOW_MS = 60_000;

function getRateStore() {
    return getStore("ontology-rate-limit");
}

function bucketKey(actionName: string, actor: string, windowStart: number): string {
    return `${actionName}:${actor.toLowerCase()}:${windowStart}`;
}

/**
 * Throws `Error("Rate limit exceeded ...")` if the actor has already used
 * up their per-minute quota for this action. Otherwise increments the
 * counter and returns silently.
 *
 * In production a Blobs failure throws — better to fail-closed than to
 * silently let a flood through. Dev mode bypasses the check entirely so
 * iteration without `netlify dev` still works.
 */
export async function enforceRateLimit(actionName: string, actor: string): Promise<void> {
    if (process.env.NODE_ENV === "development") return;
    if (!actor) throw new Error("Rate limit check missing actor");

    const now = Date.now();
    const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
    const key = bucketKey(actionName, actor, windowStart);

    const store = getRateStore();
    let count = 0;
    try {
        const raw = await store.get(key, { type: "text" });
        count = raw ? parseInt(raw, 10) : 0;
        if (Number.isNaN(count)) count = 0;
    } catch (err) {
        console.error("[FATAL] Rate-limit blob read failed:", err);
        throw new Error("Rate limiter unavailable.");
    }

    if (count >= RATE_LIMIT_PER_MINUTE) {
        throw new Error(
            `Rate limit exceeded for '${actionName}' (${RATE_LIMIT_PER_MINUTE}/min). Try again in a minute.`
        );
    }

    try {
        await store.set(key, String(count + 1));
    } catch (err) {
        console.error("[FATAL] Rate-limit blob write failed:", err);
        throw new Error("Rate limiter unavailable.");
    }
}
