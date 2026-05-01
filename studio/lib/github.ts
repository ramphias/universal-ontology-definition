import fs from "fs";
import path from "path";
import { pickGithubToken } from "./github-token";

// Public repo coordinates — not secrets, just deploy configuration.
// Hardcoded defaults so the L1/L2/L3 viewer works even when Netlify's
// Functions runtime doesn't surface these env vars (e.g. dashboard env
// scoped to production only). Override via real env vars to point a
// fork or self-host at a different repo.
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "ramphias";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "universal-ontology-definition";

export async function getOntologyLayer(layerId: string) {
  // Mapping L0, L1, L2, L3 layers to their respective raw JSON files
  const layerPathMap: Record<string, string> = {
    "L1": "l1-core/universal_ontology_v1.json",
    // Extension files can be added here
  };

  const relPath = layerPathMap[layerId];
  if (!relPath) {
    throw new Error(`Layer ${layerId} file mapping is not yet fully configured.`);
  }

  // 1. Try local file system first (FASTEST, NO API LIMITS)
  try {
     const localPath = path.join(process.cwd(), '..', relPath);
     if (fs.existsSync(localPath)) {
         const fileContent = fs.readFileSync(localPath, 'utf8');
         return JSON.parse(fileContent);
     }
  } catch (e) {
     console.warn(`Local file fallback failed for ${layerId}, trying GitHub API...`);
  }

  // 2. Fallback to GitHub API. Use the user's OAuth token if signed in,
  // otherwise the server-side read-only GITHUB_TOKEN, otherwise anonymous
  // (subject to GitHub's 60/hr rate limit).
  if (!REPO_OWNER || !REPO_NAME) {
    throw new Error(
      `GitHub repo not configured: GITHUB_REPO_OWNER=${REPO_OWNER || "(unset)"} ` +
      `GITHUB_REPO_NAME=${REPO_NAME || "(unset)"}. Set both env vars in the deploy environment.`
    );
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${relPath}`;
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3.raw",
    "User-Agent": "Ontology-Studio-App",
  };
  const token = await pickGithubToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, { headers, cache: "no-store" });
  } catch (error: any) {
    throw new Error(`GitHub fetch failed (network): ${error?.message || error}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `GitHub API ${response.status} ${response.statusText} for ${relPath}` +
      (token ? "" : " (anonymous — set GITHUB_TOKEN to lift the 60/hr limit)") +
      (body ? `: ${body.slice(0, 200)}` : "")
    );
  }

  // Since we used v3.raw, the response is directly the file content
  try {
    const textContent = await response.text();
    return JSON.parse(textContent);
  } catch (error: any) {
    throw new Error(`GitHub returned non-JSON for ${relPath}: ${error?.message || error}`);
  }
}
