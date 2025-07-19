import { Octokit } from "@octokit/rest";
import { restartServer } from "../utils/pterodactyl/pterodactyl.js";
import { loadCybranceeConfig } from "../utils/config-loader.js";
import { handleDeployment } from "../utils/github/deployments.js";
import { fetchRepoApiKey } from "../utils/repoKey.js";

export async function handlePush(payload: any, octokit: Octokit) {
  const fullRepo = payload.repository.full_name;
  const branch = payload.ref.replace("refs/heads/", "");
  const defaultBranch = payload.repository.default_branch;

  if (branch !== defaultBranch) return;

  const config = await loadCybranceeConfig(octokit, fullRepo, defaultBranch);
  if (!config) return;

  const backendUrl = process.env.PANEL_BACKEND_URL;
  let apiKey: string | null = null;

  if (backendUrl && config.username) {
    apiKey = await fetchRepoApiKey({
      backendUrl,
      username: config.username,
      repoName: fullRepo,
    });
  }

  if (config.deployOnPush && apiKey) {   
     const [owner, repo] = fullRepo.split("/");

    await handleDeployment({
      octokit,
      owner,
      repo,
      ref: branch,
      config: { ...config, apiKey },
      panelUrl: process.env.PTERODACTYL_PANEL_URL!,
    });
  }

  if (config.restartOnPush && config.serverId && apiKey) {
    await restartServer(process.env.PTERODACTYL_PANEL_URL!, apiKey, config.serverId);
  }
}
