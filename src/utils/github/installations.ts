import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { cache } from "../cache.js";

interface Options {
  appId: string;
  privateKey: string;
}

export async function getInstallations({ appId, privateKey }: Options): Promise<number> {
  const cacheKey = "installation_count";

  const cached = cache.get(cacheKey);
  if (cached !== undefined) {
    return cached as number;
  }

  const auth = createAppAuth({ appId, privateKey });
  const appAuth = await auth({ type: "app" });
  const octokit = new Octokit({ auth: appAuth.token });

  const installations = await octokit.apps.listInstallations();
  const count = installations.data.length;

  cache.set(cacheKey, count);
  return count;
}
