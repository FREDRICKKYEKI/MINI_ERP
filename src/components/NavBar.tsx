import { Link } from "react-router-dom";
import { routes } from "../App";

export const NavBar = () => {
  return (
    <nav
      className="
    shadow-md
    "
    >
      <ul className="flex justify-between items-center p-5">
        <li>
          <Link to={routes.home} className="text-lg font-bold">
            Mini ERP
          </Link>
        </li>
        <li className="flex gap-4 text-lg font-normal items-center">
          <li>
            <Link to={routes.chooseMembership} className="">
              View Plans
            </Link>
          </li>
          <li>
            <Link to={routes.signUp}>Sign Up</Link>
          </li>
          <li
            className="bg-blue-500 px-4 py-2 text-white rounded-full cursor-pointer shadow-lg
          hover:bg-blue-600 transition duration-300 ease-in-out
          "
          >
            <Link to={routes.logIn}>Log In</Link>
          </li>
        </li>
      </ul>
    </nav>
  );
};
