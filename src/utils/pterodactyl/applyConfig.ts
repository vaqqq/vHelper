import axios from "axios";
import { CybranceeConfig } from "../../interfaces/cybrancee.config.js";

interface ApplyServerConfigOptions {
  panelUrl: string;
  apiKey: string;
  serverId: string;
  config: CybranceeConfig;
}

export async function applyServerConfig({
  panelUrl,
  apiKey,
  serverId,
  config,
}: ApplyServerConfigOptions): Promise<void> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "Application/vnd.pterodactyl.v1+json",
  };

  try {
    /*const startupCommand = config.entryFile
      ? `/usr/local/bin/node /home/container/${config.entryFile}`
      : undefined;

    if (startupCommand) {
      await axios.patch(
        `${panelUrl}/api/application/servers/${serverId}/startup`,
        {
          startup: startupCommand,
        },
        { headers }
      );
    }*/

    const environmentVars: Record<string, string> = {};

    if (typeof config.npmInstall === "boolean") {
      environmentVars["NPM_INSTALL"] = config.npmInstall ? "1" : "0";
    }

    if (config.entryFile) {
      environmentVars["ENTRY_FILE"] = config.entryFile;
    }

    if (Object.keys(environmentVars).length > 0) {
      for (const [key, value] of Object.entries(environmentVars)) {
        await axios.put(
          `${panelUrl}/api/application/servers/${serverId}/startup/variable`,
          {
            key,
            value,
          },
          { headers }
        );
      }
    }

    console.log("Server config applied using current CybranceeConfig");
  } catch (error: any) {
    console.error("Failed to apply server config:", error?.response?.data || error.message);
    throw error;
  }
}
