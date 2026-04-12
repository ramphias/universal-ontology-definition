import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";

// Next.js Server Components run on the server side securely.
// We pass the token via environment variable, never exposing it to the client.
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Required for high API limits and private actions
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER as string;
const REPO_NAME = process.env.GITHUB_REPO_NAME as string;

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

  // 2. Fallback to GitHub API
  try {
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: relPath,
    });

    if ("content" in response.data && response.data.type === "file") {
      const decodedContent = Buffer.from(response.data.content, "base64").toString("utf-8");
      return JSON.parse(decodedContent);
    }
    throw new Error("Target path is not a valid file.");
  } catch (error) {
    console.error(`Error fetching ontology layer ${layerId} from GitHub:`, error);
    throw new Error("Failed to load ontology data from GitHub.");
  }
}

