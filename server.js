import fs from "node:fs/promises";
import express from "express";
import { configDotenv } from "dotenv";
// import registerPesaPal from "./routes/pesapal/registerPesaPal.js";
import logger from "./logger.js";
// ================== load env variables ==================
configDotenv({ path: "BACKEND.ENV" });
// ========================================================

// ngrok url
const ngrok_url = "https://d7f6-80-240-201-175.ngrok-free.app";
const MODE = process.env.MODE;

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";
const ssrManifest = isProduction
  ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
const { createServer } = await import("vite");
vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  base,
});

if (!isProduction) {
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

// ========================= Check if MODE is set ======================
if (!MODE) {
  logger.error("`MODE` env variable is required!!!");
  process.exit(1);
} else if (["DEV", "PROD"].includes(MODE) === false) {
  logger.error("`MODE` env variable must be either `DEV` or `PROD`!!!");
  process.exit(1);
}
// =====================================================================

logger.info(`MODE: ${MODE}`);

// ========================= import routes ======================
const registerPesaPal = await vite.ssrLoadModule(
  "/routes/pesapal/registerPesaPal.ts"
);
// ==============================================================

// register routes
app.use("/pesapal", registerPesaPal.default);

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      render = (await import("./dist/server/entry-server.js")).render;
    }

    const rendered = await render(req.originalUrl, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
});
