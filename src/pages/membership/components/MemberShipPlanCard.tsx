import { FC } from "react";
import { membershipPlanType } from "../../../types";

interface MemberShipPlanCardProps {
  plan: membershipPlanType;
}
export const MemberShipPlanCard: FC<MemberShipPlanCardProps> = ({ plan }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 flex">
      <div className="bg-white p-4 rounded-lg shadow flex-grow h-full flex flex-col">
        <h2 className="text-xl font-bold">{plan.name}</h2>
        <p className="text-gray-500">${plan.price}</p>
        <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded w-full">
          Choose
        </button>
        {/* features */}
        <ul className="mt-4">
          {plan.includes.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-500">
              <TickSVG />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TickSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);