import { Octokit } from "@octokit/rest";
import { restartServer } from "../utils/pterodactyl";
import { loadCybranceeConfig } from "../utils/config-loader";

export async function handlePush(payload: any, octokit: Octokit) {
  const fullRepo = payload.repository.full_name;
  const branch = payload.ref.replace("refs/heads/", "");
  const defaultBranch = payload.repository.default_branch;

  if (branch !== defaultBranch) return;

  const config = await loadCybranceeConfig(octokit, fullRepo, defaultBranch);
  if (!config || !config.restartOnPush) return;

  if (config.serverId && config.apiKey) {
    await restartServer(process.env.PTERODACTYL_PANEL_URL!, config.apiKey, config.serverId);
  } else {
    console.warn("No server id or api key");
  }
}
