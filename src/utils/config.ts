import { Octokit } from "@octokit/rest";
import { CybranceeConfig } from "../interfaces/cybrancee.config";

export async function getFileFromRepo(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string | null> {
  try {
    const res = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    if (!Array.isArray(res.data) && "content" in res.data && res.data.content) {
      return Buffer.from(res.data.content, "base64").toString("utf8");
    }
  } catch (error) {
    console.error("Failed to fetch config file:", error);
  }
  return null;
}

export async function parseConfig(raw: string, ext: string): Promise<any> {
  if (ext === "json") {
    return JSON.parse(raw);
  } else if (ext === "js" || ext === "ts") {
    const blob = new Blob([raw], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    try {
      const module = await import(url);
      return module.default || module;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  throw new Error("Unsupported config file type");
}



export async function shouldRestartFromConfig(config: CybranceeConfig): Promise<boolean> {
  return config.restartOnPush === true;
}
