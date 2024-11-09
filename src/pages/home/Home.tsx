import { routes } from "../../App";
import { NavBar } from "../../components/NavBar";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="text-center flex justify-center mt-7">
        <div className="flex flex-col h-max p-2">
          <h1>Welcome to Mini ERP Project</h1>
          <p className="mt-3">
            Manage your subscriptions and contributions seamlessly.
          </p>
          <a
            href={routes.chooseMembership}
            className="m-2 px-2 py-2 w-full text-xl font-bold text-white bg-blue-500 rounded-lg cursor-pointer
          hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg max-w-[400px] mx-auto
          "
          >
            View Plans
          </a>
        </div>
      </div>
    </>
  );
};
export default Home;
