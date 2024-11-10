import fs from "node:fs/promises";
import express from "express";
import { configDotenv } from "dotenv";
import logger from "./logger.js";
import cookieParser from "cookie-parser";
// ================== load env variables ==================
configDotenv({ path: "BACKEND.ENV" });
// ========================================================

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

// ========================= Middlewares ======================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// ==========================================================

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

// ========================= import ts packages ======================
const apiEntryPoint = await vite.ssrLoadModule("/routes/apiEntryPoint.ts");
const utils = await vite.ssrLoadModule("/routes/utils.ts");
const checkAuth = utils.checkAuth;
const getServerSideProps_ = await vite.ssrLoadModule(
  "/helpers/getServerSideProps.ts"
);
const middlewares = await vite.ssrLoadModule(
  "/routes/middlewares/middlewares.ts"
);
const authRedirect = middlewares.authRedirect;
const getServerSideProps = getServerSideProps_.default;
// ==============================================================

// register routes
app.use("/api", apiEntryPoint.default);

// add middlewares
app.use("/login", authRedirect);
app.use("/signup", authRedirect);

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    // check if user is authenticated and attach user object to the request object
    await checkAuth(req);
    const url = req.originalUrl.replace(base, "");

    // log the request
    const method = req.method;
    logger.info(`[${method}]: /${url}`);

    // attaches server side props to the request object
    await getServerSideProps(req);

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

    const rendered = await render(req.originalUrl, ssrManifest, req);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(`<!--app-script-->`, rendered.script ?? "");

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
