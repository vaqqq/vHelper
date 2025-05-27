import { Octokit } from "@octokit/rest";
import { CybranceeConfig } from "../interfaces/cybrancee.config";

const configFileRegex = /^cybrancee\.config\.(json|js|ts)$/i;

export async function loadCybranceeConfig(
  octokit: Octokit,
  repo: string,
  branch: string
): Promise<CybranceeConfig | null> {
  const [owner, name] = repo.split("/");

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo: name,
      path: "",
      ref: branch,
    });

    if (!Array.isArray(data)) return null;

    const configEntry = data.find(
      (item) => "name" in item && configFileRegex.test(item.name)
    );

    if (!configEntry || !("path" in configEntry)) return null;

    const file = await octokit.repos.getContent({
      owner,
      repo: name,
      path: configEntry.path,
      ref: branch,
    });

    if (!("content" in file.data)) return null;

    const decoded = Buffer.from(file.data.content, "base64").toString();
    return JSON.parse(decoded);
  } catch (err) {
    console.warn("config couldnt load:", err);
    return null;
  }
}
