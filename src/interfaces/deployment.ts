import { Octokit } from "@octokit/rest";

export interface DeploymentOptions {
  octokit: Octokit;
  owner: string;
  repo: string;
  ref: string;
  environment?: string;
  logUrl?: string;
  description?: string;
  environmentUrl?: string;
}