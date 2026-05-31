/**
 * Typed HTTP client for `uod-backend` (the FastAPI service holding the
 * private instance store). Mirrors the OpenAPI shapes from
 * github.com/ramphias/uod-backend/app/schemas.py.
 *
 * Server-side only — `mintBackendToken` reads the NextAuth session cookie
 * so this module breaks in the browser.
 */
import { mintBackendToken } from "./backend-token";

const DEFAULT_BACKEND_URL = "https://uod-backend.fly.dev";

function backendUrl(): string {
    const raw = process.env.BACKEND_URL?.trim();
    if (!raw) return DEFAULT_BACKEND_URL;
    return raw.replace(/\/+$/, "");
}

// ── Types (mirror backend Pydantic schemas) ─────────────────────────────

export type InstanceStatus = "candidate" | "accepted" | "rejected" | "archived";

export type InstanceSource =
    | "manual"
    | "wikidata"
    | "dbpedia"
    | "sec_edgar"
    | "openalex"
    | "llm_extracted"
    | "other";

export type InstanceRead = {
    id: string;
    type: string;
    layer: string;
    label_en: string | null;
    label_zh: string | null;
    data: Record<string, unknown>;
    schema_version: string;
    source: InstanceSource;
    source_url: string | null;
    source_id: string | null;
    confidence: number | null;
    status: InstanceStatus;
    harvested_at: string;
    verified_by: string | null;
    verified_at: string | null;
};

export type InstanceList = {
    items: InstanceRead[];
    total: number;
    limit: number;
    offset: number;
};

export type ListFilters = {
    layer?: string;
    type?: string;
    status?: InstanceStatus;
    q?: string;
    limit?: number;
    offset?: number;
};

export type BackendHealth = {
    status: "ok" | "degraded";
    version: string;
    database: "up" | "down";
    timestamp: string;
};

// ── Errors ──────────────────────────────────────────────────────────────

export class BackendError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly body: string,
        message?: string
    ) {
        super(message ?? `Backend returned ${statusCode}: ${body.slice(0, 200)}`);
        this.name = "BackendError";
    }
}

export class BackendUnauthenticatedError extends Error {
    constructor() {
        super("No active Studio session — cannot call backend.");
        this.name = "BackendUnauthenticatedError";
    }
}

// ── Public surface ──────────────────────────────────────────────────────

/**
 * Public — no auth needed. Useful for status banners.
 */
export async function backendHealth(): Promise<BackendHealth> {
    const res = await fetch(`${backendUrl()}/health`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
    });
    if (!res.ok) {
        throw new BackendError(res.status, await res.text());
    }
    return res.json();
}

/**
 * List instances with optional filters and pagination. Requires a Studio
 * session; throws `BackendUnauthenticatedError` if the caller is logged out.
 */
export async function listInstances(filters: ListFilters = {}): Promise<InstanceList> {
    const minted = await mintBackendToken();
    if (!minted) throw new BackendUnauthenticatedError();

    const params = new URLSearchParams();
    if (filters.layer) params.set("layer", filters.layer);
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.q) params.set("q", filters.q);
    if (filters.limit !== undefined) params.set("limit", String(filters.limit));
    if (filters.offset !== undefined) params.set("offset", String(filters.offset));

    const qs = params.toString();
    const url = `${backendUrl()}/instances${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, {
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${minted.token}`,
            Accept: "application/json",
        },
    });
    if (!res.ok) {
        throw new BackendError(res.status, await res.text());
    }
    return res.json();
}

/**
 * Fetch one instance by id. Returns null on 404 instead of throwing.
 */
export async function getInstance(id: string): Promise<InstanceRead | null> {
    const minted = await mintBackendToken();
    if (!minted) throw new BackendUnauthenticatedError();

    const res = await fetch(`${backendUrl()}/instances/${encodeURIComponent(id)}`, {
        cache: "no-store",
        headers: {
            Authorization: `Bearer ${minted.token}`,
            Accept: "application/json",
        },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
        throw new BackendError(res.status, await res.text());
    }
    return res.json();
}
