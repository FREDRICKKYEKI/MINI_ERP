import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import ChooseMembership from "./pages/membership/ChooseMembership";
import SuccessPage from "./pages/success/SuccessPage";
import LogIn from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";

function App() {
  return (
    <Routes>
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.chooseMembership} element={<ChooseMembership />} />
      <Route path={routes.success} element={<SuccessPage />} />
      <Route path={routes.logIn} element={<LogIn />} />
      <Route path={routes.signUp} element={<SignUp />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App;

// region routes
// ============================== routes ==============================
export const routes = {
  home: "/",
  chooseMembership: "/plans",
  success: "/success",
  logIn: "/login",
  signUp: "/signup",
  api: (endpoint: string) => `/api/v1/${endpoint}`, //FIXME: the version should be dynamic and not hardcoded
};
// =====================================================================
// endregion routes
