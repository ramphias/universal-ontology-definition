"use server";

import { Octokit } from "@octokit/rest";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER as string;
const REPO_NAME = process.env.GITHUB_REPO_NAME as string;

async function requireAuth() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
}

const PROJECT_ROOT = path.resolve(process.cwd(), '..');

/**
 * Given a layer identifier (L1, or {layer: 'L2'|'L3', domain: 'fnb'}),
 * return the repo-relative path to the canonical ontology JSON file.
 * Needed by the editor so PropertiesPanel knows which file to patch when
 * users submit edits.
 */
export async function resolveLayerFile(
  layer: "L1" | "L2" | "L3",
  domain?: string
): Promise<string | null> {
  if (layer === "L1") return "l1-core/universal_ontology_v1.json";
  if (!domain || !/^[a-z0-9-]+$/.test(domain)) return null;

  const dirName = layer === "L2" ? `l2-extensions/${domain}` : `l3-enterprise/${domain}`;
  const safeDirPath = safePath(dirName);

  // Local filesystem first
  if (safeDirPath && fs.existsSync(safeDirPath)) {
    try {
      const items = fs.readdirSync(safeDirPath, { withFileTypes: true });
      const jsonFile = items.find((f) => f.isFile() && f.name.endsWith(".json"));
      if (jsonFile) return `${dirName}/${jsonFile.name}`;
    } catch {
      // fall through to GitHub API
    }
  }

  // GitHub API fallback
  try {
    const dirResponse = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: dirName,
    });
    if (Array.isArray(dirResponse.data)) {
      const jsonFile = dirResponse.data.find((f) => f.name.endsWith(".json"));
      if (jsonFile) return `${dirName}/${jsonFile.name}`;
    }
  } catch {
    // ignore
  }
  return null;
}

function safePath(relativePath: string): string | null {
    const resolved = path.resolve(PROJECT_ROOT, relativePath);
    if (!resolved.startsWith(PROJECT_ROOT + path.sep)) return null;
    return resolved;
}

function getLocalDirs(relativePath: string) {
    try {
        const localDirPath = safePath(relativePath);
        if (!localDirPath || !fs.existsSync(localDirPath)) return null;
        const items = fs.readdirSync(localDirPath, { withFileTypes: true });
        return items
            .filter(item => item.isDirectory() && !item.name.startsWith("_"))
            .map(dir => ({
                id: dir.name,
                name: dir.name.toUpperCase().replace("-", " "),
            }));
    } catch (e) {
        // ignore
    }
    return null;
}

function getLocalJsonFromDir(relativePath: string) {
    try {
        const localDirPath = safePath(relativePath);
        if (!localDirPath || !fs.existsSync(localDirPath)) return null;
        const items = fs.readdirSync(localDirPath, { withFileTypes: true });
        const jsonFile = items.find(f => f.isFile() && f.name.endsWith('.json'));
        if (jsonFile) {
            const filePath = path.join(localDirPath, jsonFile.name);
            if (!filePath.startsWith(PROJECT_ROOT + path.sep)) return null;
            const fileContent = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(fileContent);
        }
    } catch (e) {
        // ignore
    }
    return null;
}

/**
 * 抓取 l2-extensions 下的所有合法子域目录
 */
export async function getAvailableL2Extensions() {
  const localData = getLocalDirs("l2-extensions");
  if (localData) return localData;

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/l2-extensions`;
    const headers: Record<string, string> = { "User-Agent": "Ontology-Studio-App" };
    if (process.env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) return [];
    
    const data = await response.json();
    if (Array.isArray(data)) {
      return data
        .filter((item: any) => item.type === "dir" && !item.name.startsWith("_"))
        .map((dir: any) => ({
          id: dir.name,
          name: dir.name.toUpperCase().replace("-", " "),
        }));
    }
    return [];
  } catch (error) {
    console.error("Failed to list L2 extensions", error);
    return [];
  }
}

/**
 * 动态读取指定 L2 目录下的 .json 文件内容
 */
export async function fetchExtensionData(domainId: string) {
  if (!/^[a-z0-9-]+$/.test(domainId)) throw new Error("Invalid domain ID");

  const localData = getLocalJsonFromDir(`l2-extensions/${domainId}`);
  if (localData) return localData;

  try {
    const dirResponse = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `l2-extensions/${domainId}`,
    });

    if (Array.isArray(dirResponse.data)) {
      const jsonFile = dirResponse.data.find(f => f.name.endsWith('.json'));
      if (jsonFile) {
        const fileResponse = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: jsonFile.path,
        });

        if ("content" in fileResponse.data) {
          const decodedContent = Buffer.from((fileResponse.data as any).content, "base64").toString("utf-8");
          return JSON.parse(decodedContent);
        }
      }
    }
    throw new Error("No JSON file found in extension");
  } catch (error) {
    console.error(`Failed to load extension ${domainId}`, error);
    return null;
  }
}

/**
 * 抓取 l3-enterprise 下的所有合法子域目录
 */
export async function getAvailableL3Enterprises() {
  const localData = getLocalDirs("l3-enterprise");
  if (localData) return localData;

  try {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/l3-enterprise`;
    const headers: Record<string, string> = { "User-Agent": "Ontology-Studio-App" };
    if (process.env.GITHUB_TOKEN) headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) return [];

    const data = await response.json();
    if (Array.isArray(data)) {
      return data
        .filter((item: any) => item.type === "dir" && !item.name.startsWith("_"))
        .map((dir: any) => ({
          id: dir.name,
          name: dir.name.toUpperCase().replace("-", " "),
        }));
    }
    return [];
  } catch (error) {
    console.error("Failed to list L3 enterprises", error);
    return [];
  }
}

/**
 * 动态读取指定 L3 目录下的 .json 文件内容
 */
export async function fetchL3EnterpriseData(domainId: string) {
  if (!/^[a-z0-9-]+$/.test(domainId)) throw new Error("Invalid domain ID");
  
  const localData = getLocalJsonFromDir(`l3-enterprise/${domainId}`);
  if (localData) return localData;

  try {
    const dirResponse = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `l3-enterprise/${domainId}`,
    });

    if (Array.isArray(dirResponse.data)) {
      const jsonFile = dirResponse.data.find(f => f.name.endsWith('.json'));
      if (jsonFile) {
        const fileResponse = await octokit.repos.getContent({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          path: jsonFile.path,
        });

        if ("content" in fileResponse.data) {
          const decodedContent = Buffer.from((fileResponse.data as any).content, "base64").toString("utf-8");
          return JSON.parse(decodedContent);
        }
      }
    }
    throw new Error("No JSON file found in L3 enterprise");
  } catch (error) {
    console.error(`Failed to load L3 enterprise ${domainId}`, error);
    return null;
  }
}
