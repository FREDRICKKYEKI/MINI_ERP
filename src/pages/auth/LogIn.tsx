import { Link } from "react-router-dom";
import { routes } from "../../App";

const LogIn = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <GoHome />
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Welcome Back to Mini ERP 👋🏽
          <div className="mt-4">Log in</div>
        </h2>
        <form action={routes.api("auth/login")} method="POST">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>

          <p className="mt-4">
            Don't have an account?{" "}
            <a
              href={routes.signUp}
              className="text-blue-500 font-semibold underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;

export const GoHome = () => {
  return (
    <p className="mb-4">
      &larr; Go{" "}
      <Link to={routes.home} className="text-blue-500 font-semibold underline">
        Home
      </Link>
    </p>
  );
};
