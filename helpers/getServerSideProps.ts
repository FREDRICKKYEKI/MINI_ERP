import { Request } from "express";
import Subscription from "../db_engine/models/Subscription";
import Contribution from "../db_engine/models/Contribution";
import User from "../db_engine/models/User";
import Transaction from "../db_engine/models/Transaction";
import Role from "../db_engine/models/Role";

/**
 * @description Get server side props for different pages
 * @param req - Request
 */

const getServerSideProps = async (req: any) => {
  // Extract pathname by splitting on '?' and taking the first part
  const basePath = req.baseUrl;
  req.__global_props__ = {};

  // check if user is subscribed
  if (req.user) {
    const user = (req as any).user;
    const subscription = await Subscription.findOne({
      where: { user_id: user.id, status: "active" },
    });

    if (subscription) {
      // if user is subscribed add subscription details to the user object
      req.user.isSubscribed = true;
      req.user.subscription = subscription;
    } else {
      req.user.isSubscribed = false;
    }
    // add user to global props
    req.__global_props__.user = req.user;
  }
  switch (basePath) {
    // CONTINUE: handle different base paths and add their respective props
    case "":
      console.debug("/home");
      break;
    case "/plans":
      console.debug("/plans");
      break;
    case "/subscriptions":
      break;
    case "/admin/dashboard":
      req.__global_props__.tables = {};
      // 1. Retrieve all users without password
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      // 2. Retrieve all subscriptions
      const subscriptions = await Subscription.findAll({});
      // 3. Retrieve all contributions
      const contributions = await Contribution.findAll({});
      // 4. Retrieve all transactions
      const transactions = await Transaction.findAll({});
      // 5. Retrieve all roles
      const roles = await Role.findAll({});

      // Add tables to global props
      req.__global_props__.tables = {
        users,
        subscriptions,
        contributions,
        transactions,
        roles,
      };

      break;
    default:
      break;
  }
};

export default getServerSideProps;
