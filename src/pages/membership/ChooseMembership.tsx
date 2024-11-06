import { membershipPlans } from "../../utils";
import { MemberShipPlanCard } from "./components/MemberShipPlanCard";

const ChooseMembership = () => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Choose Membership</h1>
      <div className="flex flex-wrap gap-4 justify-center bg-red-100">
        {/* Membership plans */}
        {membershipPlans.map((plan, index) => (
          <MemberShipPlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default ChooseMembership;
