import { membershipPlanType } from "./types";

/**
 * @description Membership plans
 */
export const membershipPlans: membershipPlanType[] = [
  {
    name: "Free",
    price: 0,
    includes: [
      "Unlimited access to all courses",
      "Access to all exercises",
      "Downloadable resources",
    ],
  },
  {
    name: "Pro",
    price: 2500,
    includes: ["All features in Free plan", "Priority support"],
  },
  {
    name: "Enterprise",
    price: 5000,
    includes: ["All features in Pro plan", "1:1 mentorship"],
  },
];
