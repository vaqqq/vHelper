import { DeploymentOptions } from "../../interfaces/deployment.js";
import { applyServerConfig } from "../pterodactyl/applyConfig.js";

export async function handleDeployment({
  octokit,
  owner,
  repo,
  ref,
  environment = "production",
  config,
  panelUrl,
}: DeploymentOptions & {
  config: any;
  panelUrl: string;
}): Promise<void> {
  try {
    const deploymentResponse = await octokit.repos.createDeployment({
      owner,
      repo,
      ref,
      auto_merge: false,
      required_contexts: [],
      environment,
    });

    const deploymentId = (deploymentResponse.data as { id: number }).id;

    try {
      await applyServerConfig({
        panelUrl,
        apiKey: config.apiKey,
        serverId: config.serverId,
        config
      });

      await octokit.repos.createDeploymentStatus({
        owner,
        repo,
        deployment_id: deploymentId,
        state: "success",
        description: "Cybrancee configuration applied successfully",
      });

      console.log(`Deployment completed for ${repo}@${ref}`);
    } catch (err) {
      console.error("Config application failed:", err);

      await octokit.repos.createDeploymentStatus({
        owner,
        repo,
        deployment_id: deploymentId,
        state: "failure",
        description: "Failed to apply server config.",
      });
    }
  } catch (error) {
    console.error("Deployment initiation failed:", error);
  }
}
