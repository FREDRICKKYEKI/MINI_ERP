import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import ChooseMembership from "./pages/membership/ChooseMembership";

function App() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.chooseMembership} element={<ChooseMembership />} />
    </Routes>
  );
}

export default App;

// region routes
// ============================== routes ==============================
export const routes = {
  home: "/",
  chooseMembership: "/plans",
};
// =====================================================================
// endregion routes
