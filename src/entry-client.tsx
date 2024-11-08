import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./contexts/AppContext";

declare global {
  interface Window {
    __isAuth__: boolean;
    __GLOBAL_STATE__: any;
  }
}

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider isSignedIn={window?.__isAuth__ as boolean}>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
