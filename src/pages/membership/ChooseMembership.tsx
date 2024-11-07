import { NavBar } from "../../components/NavBar";
import { membershipPlans } from "../../utils";
import { MemberShipPlanCard } from "./components/MemberShipPlanCard";

const ChooseMembership = () => {
  return (
    <>
      <title>Mini ERP Project | Choose Membership</title>
      <NavBar />
      <div className="p-5 m-auto">
        <div className="flex flex-col w-full mx-auto max-w-[700px]">
          <h1 className="text-2xl font-bold">Choose Membership</h1>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
         gap-4 justify-center "
          >
            {membershipPlans.map((plan, index) => (
              <MemberShipPlanCard key={index} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseMembership;
