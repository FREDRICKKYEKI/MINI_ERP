import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { StaticRouter } from "react-router-dom/server";
import AppContextProvider from "./contexts/AppContext";

export function render(url: string, _options: any, isAuth: boolean) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppContextProvider isSignedIn={isAuth}>
          <App />
        </AppContextProvider>
      </StaticRouter>
    </StrictMode>
  );
  const script = `<script>window.__isAuth__ = ${isAuth}</script>`;
  return { html, script };
}
