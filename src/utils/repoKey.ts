import axios from "axios";

export async function fetchRepoApiKey({ backendUrl, username, repoName, token  }: repoKeyOptions): Promise<string | null> {
  try {
    TODO:"add repository as a parameter"
    const res = await axios.get(`${backendUrl}/get/repo_keys`, {
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