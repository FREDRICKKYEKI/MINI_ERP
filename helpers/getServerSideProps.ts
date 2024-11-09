import { Request } from "express";
import pkg_sub from "../db_engine/models/Subscription";

const Subscription = pkg_sub;

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
    default:
      break;
  }
};

export default getServerSideProps;
