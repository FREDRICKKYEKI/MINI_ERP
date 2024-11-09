import { membershipPlanType } from "./types";

/**
 * @description Membership plans
 * These should be stored in the database in a real-world application but for this project,
 * we'll hardcode them since this is a DEMO.
 * @type {membershipPlanType[]}
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

// capitalize the first letter of a string
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
