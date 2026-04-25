/**
 * Explicit whitelist of domain IDs that the Studio is allowed to address
 * via L2 / L3 layerFile paths. Adding a new domain to disk does NOT
 * automatically grant the Studio write access to it — the registry must be
 * updated in code review, which is the point of this gate.
 *
 * Keep entries in sync with on-disk directories under `l2-extensions/` and
 * `l3-enterprise/`. CI cross-checks this list against the filesystem (see
 * scripts/check_domain_registry.py — to be added in Phase 4).
 */

export const ALLOWED_L2_DOMAINS: ReadonlyArray<string> = [
    "consulting",
    "financial-services",
    "fnb",
    "healthcare",
    "luxury-goods",
    "manufacturing",
    "technology",
];

export const ALLOWED_L3_DOMAINS: ReadonlyArray<string> = [
    "acme-tech-solutions",
];

const L2_SET = new Set(ALLOWED_L2_DOMAINS);
const L3_SET = new Set(ALLOWED_L3_DOMAINS);

export function isAllowedL2Domain(domain: string): boolean {
    return L2_SET.has(domain);
}

export function isAllowedL3Domain(domain: string): boolean {
    return L3_SET.has(domain);
}

/**
 * Validate a layerFile path against the registry. Accepts:
 *   - `l1-core/<file>.json`
 *   - `l2-extensions/<domain>/<file>.json` where `<domain>` is whitelisted
 *   - `l3-enterprise/<domain>/<file>.json` where `<domain>` is whitelisted
 *
 * Returns null if accepted, or an error message string if rejected.
 */
export function validateLayerFile(layerFile: string): string | null {
    const m = /^(l1-core|l2-extensions\/([a-z0-9-]+)|l3-enterprise\/([a-z0-9-]+))\/[a-z0-9_]+\.json$/.exec(layerFile);
    if (!m) return "Invalid layer file path";

    const l2Domain = m[2];
    const l3Domain = m[3];
    if (l2Domain && !isAllowedL2Domain(l2Domain)) {
        return `L2 domain '${l2Domain}' is not in the registry`;
    }
    if (l3Domain && !isAllowedL3Domain(l3Domain)) {
        return `L3 domain '${l3Domain}' is not in the registry`;
    }
    return null;
}
