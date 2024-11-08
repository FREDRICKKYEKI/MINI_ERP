import { Link } from "react-router-dom";
import { routes } from "../../App";
import { useEffect } from "react";

const SignUp = () => {
  useEffect(() => {
    // get url param
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
      alert(error);
    }
  }, []);
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    //   check if password and confirm password match
    if (data.password !== data.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    // console.log(data);

    //   submit form
    form.submit();
  };
  return (
    <>
      <head>
        <title>Mini ERP | Sign Up</title>
      </head>
      <div className="flex justify-center items-center h-screen bg-gray-100 pt-3">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Sign Up to Mini ERP
          </h2>
          {/* TODO: add onsubmt action and method */}
          {/* TODO: check password and confirm password */}
          <form
            onSubmit={handleSignUp}
            method="POST"
            action={routes.api("auth/signUp")}
          >
            {/* names */}
            <div id="names" className="flex gap-2 ">
              <div className="first_name">
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone"
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* password */}
            <div className="mb-4">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* confirm password */}
            <div className="mb-4">
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* region role */}
            {/* FIXME: These should come from the backend */}
            <div className="mb-4">
              <label
                className="block text-gray-600 font-semibold mb-2"
                htmlFor="role"
              >
                Join as ?
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Admin</option>
                <option value="2">Member</option>
              </select>
            </div>

            {/* submit btn */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>

            <p className="mt-4">
              Already have an account?{" "}
              <Link
                to={routes.logIn}
                className="text-blue-500 font-semibold underline"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
