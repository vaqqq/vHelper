import express from "express";
import { Webhooks } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import dotenv from "dotenv";
import helmet from "helmet";

import { handlePush } from "./events/push.js";
import { handleIssue } from "./events/issue.js";
import { getInstallations } from "./utils/github/installations.js";


dotenv.config();

const privateKey = process.env.PRIVATE_KEY!
  .replace(/\\n/g, '\n')
  .replace('-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----\n')
  .replace('-----END RSA PRIVATE KEY-----', '\n-----END RSA PRIVATE KEY-----');

const webhooks = new Webhooks({ secret: process.env.WEBHOOK_SECRET! });

webhooks.on("push", async ({ payload }) => {
  const installationId = payload.installation!.id;

  const auth = createAppAuth({
    appId: process.env.APP_ID!,
    privateKey,
    installationId,
  });

  const { token } = await auth({ type: "installation" });
  const octokit = new Octokit({ auth: token });

  await handlePush(payload, octokit);
});

webhooks.on("issues.opened", async ({ payload }) => {
  const installationId = payload.installation!.id;

  const auth = createAppAuth({
    appId: process.env.APP_ID!,
    privateKey,
    installationId,
  });

  const { token } = await auth({ type: "installation" });
  const octokit = new Octokit({ auth: token });

  await handleIssue(payload, octokit);
});

const app = express();
app.disable("x-powered-by");
app.use(helmet());

app.post("/webhooks", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    await webhooks.verifyAndReceive({
      id: req.headers["x-github-delivery"] as string,
      name: req.headers["x-github-event"] as string,
      signature: req.headers["x-hub-signature-256"] as string,
      payload: Buffer.from(req.body).toString("utf8"),
    });

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send("Invalid signature");
  }
});

app.get("/", async (req, res) => {
  try {
    const installationCount = await getInstallations({
      appId: process.env.APP_ID!,
      privateKey,
    });

    res.json({
      data: {
        info: "VHelper is a GitHub App integration that enables automated deployments and server actions for Cybrancee. Learn more at: https://github.com/vaqqq/vhelper",
        installations: installationCount,      },
      success: true,
    });
  } catch (err) {
    console.error("Error fetching installation count:", err);
    res.status(500).json({
      data: {
        info: "Unable to fetch installation data.",
        installations: "unknown",
      },
      success: false,
    });
  }
});


app.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});
