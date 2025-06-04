import { UserClient } from "pterodactyl.ts";

export async function restartServer(panel: string, apiKey: string, serverId: string) {
  const client = new UserClient({ panel, apikey: apiKey });

  try {
    const server = await client.getServer(serverId);
    await server.restart();
    console.log(`Server ${serverId} restarted`);
  } catch (error) {
    console.error("Restart error:", error);
  }
}
