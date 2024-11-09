import { Link } from "react-router-dom";
import { routes } from "../App";
import { useAppContext } from "../contexts/AppContext";

export const NavBar = () => {
  const isAuth: boolean | undefined = useAppContext().isSignedIn;
  const isSubbed = useAppContext().globalState?.user?.isSubscribed;

  return (
    <nav
      className="
    shadow-md
    "
    >
      <ul className="flex justify-between items-center p-5">
        <li>
          <a href={routes.home} className="text-lg font-bold">
            Mini ERP
          </a>
        </li>
        <li className="flex gap-4 text-lg font-normal items-center">
          {!isSubbed && (
            <li>
              <a href={routes.chooseMembership} className="">
                View Plans
              </a>
            </li>
          )}
          {isAuth ? (
            <>
              <li>
                <a href={routes.dashboard} className="">
                  Dashboard
                </a>
              </li>
              <li className="bg-blue-500 px-4 py-2 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                <a href={routes.api("auth/logout")}>Log Out</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={routes.signUp}>Sign Up</Link>
              </li>
              <li className="bg-blue-500 px-4 py-2 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                <Link to={routes.logIn}>Log In</Link>
              </li>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};
