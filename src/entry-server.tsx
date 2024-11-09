import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { StaticRouter } from "react-router-dom/server";
import AppContextProvider from "./contexts/AppContext";

export function render(url: string, _options: any, req: any) {
  const isAuth = req.user ? true : false;
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppContextProvider
          isSignedIn={isAuth}
          globalState={req.__global_props__}
        >
          <App />
        </AppContextProvider>
      </StaticRouter>
    </StrictMode>
  );
  const script = `<script>
  window.__isAuth__ = ${isAuth}
  window.__GLOBAL_STATE__ = ${JSON.stringify(req.__global_props__)}
  </script>`;
  return { html, script };
}
