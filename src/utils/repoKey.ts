import axios from "axios";
import { repoKeyOptions } from "../interfaces/repoKey.js";

export async function fetchRepoApiKey({ backendUrl, username, repoName, token  }: repoKeyOptions): Promise<string | null> {
  try {
    const res = await axios.get(`${backendUrl}/get/${encodeURIComponent(repoName)}`, {
      params: { uid: username },
      headers: { Authorization: `Bearer ${token}` }
    });
    if (Array.isArray(res.data)) {
      const entry = res.data.find((r: any) => r.repo_name === repoName);
      if (entry && entry.api_key) {
        return entry.api_key as string;
      }
    }
  } catch (err) {
    console.error("Failed to fetch repo key:", err);
  }
  return null;
}