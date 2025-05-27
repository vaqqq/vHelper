import { Octokit } from "@octokit/rest";

export async function handleIssue(payload: any, octokit: Octokit) {
  try {
    await octokit.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      body: "I finally work!",
    });

    console.log("Issue comment sent");
  } catch (err) {
    console.error("Failed to comment:", err);
  }
}
