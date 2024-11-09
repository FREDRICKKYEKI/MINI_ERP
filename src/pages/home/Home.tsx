import { routes } from "../../App";
import { NavBar } from "../../components/NavBar";
import { useAppContext } from "../../contexts/AppContext";

const Home = () => {
  const isSubbed = useAppContext().globalState?.user?.isSubscribed;
  if (isSubbed) {
    const subscription: { type: "Free" | "Pro" | "Enterprise" } =
      useAppContext().globalState?.user?.subscription;
    const sub_color = {
      Free: "text-green-500",
      Pro: "text-blue-500",
      Enterprise: "text-purple-500",
    };
    return (
      <>
        <NavBar />
        <div className="text-center flex justify-center mt-7">
          <div className="flex flex-col h-max p-2">
            <h1>Welcome to Mini ERP Project</h1>
            <i>
              You are
              <span className="text-green-500 font-bold"> subscribed</span> to
              the{" "}
              <span className={`${sub_color[subscription.type]} font-bold`}>
                {subscription.type}
              </span>{" "}
              plan
            </i>
            {/**
             * We can add a feature to allow users to:
             * 1. Cancel subscription, in which case we update the subscription status to
             *    "cancelled" and refund the prorated amount.
             * 2. Upgrade/Downgrade subscription, in which case we update the subscription status to
             *   "cancelled", refund the prorated amount, then create a new subscription.
             * 3. View subscription details.
             * */}
            <a
              href={routes.api("submitOrder/make_contribution")}
              className="m-2 px-2 py-2 w-full text-xl font-bold text-white bg-green-500 rounded-lg cursor-pointer
          hover:bg-blue-600 transition duration-300 ease-in-out shadow-lg max-w-[400px] mx-auto
          "
            >
              Make Contribution
            </a>
          </div>
        </div>
      </>
    );
  }

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
