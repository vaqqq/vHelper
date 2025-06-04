import { Octokit } from "@octokit/rest";
import { restartServer } from "../utils/pterodactyl/pterodactyl.js";
import { loadCybranceeConfig } from "../utils/config-loader.js";
import { handleDeployment } from "../utils/github/deployments.js";

export async function handlePush(payload: any, octokit: Octokit) {
  const fullRepo = payload.repository.full_name;
  const branch = payload.ref.replace("refs/heads/", "");
  const defaultBranch = payload.repository.default_branch;

  if (branch !== defaultBranch) return;

  const config = await loadCybranceeConfig(octokit, fullRepo, defaultBranch);
  if (!config) return;

    if (config.deployOnPush) {
    const [owner, repo] = fullRepo.split("/");

  await handleDeployment({
    octokit,
    owner,
    repo,
    ref: branch,
    config,
    panelUrl: process.env.PTERODACTYL_PANEL_URL!,
  });
  }

  if (config.restartOnPush && config.serverId && config.apiKey) {
    await restartServer(process.env.PTERODACTYL_PANEL_URL!, config.apiKey, config.serverId);
  }
}
