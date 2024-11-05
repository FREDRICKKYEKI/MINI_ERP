import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
    </Routes>
  );
}

export default App;

// region routes
// ============================== routes ==============================
export const routes = {
  home: "/",
};
// =====================================================================
// endregion routes
