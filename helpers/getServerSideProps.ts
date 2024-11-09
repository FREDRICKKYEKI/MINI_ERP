import { Request } from "express";

/**
 * @description Get server side props for different pages
 * @param req - Request
 */

const getServerSideProps = (req: Request) => {
  // Extract pathname by splitting on '?' and taking the first part
  const basePath = req.baseUrl;
  switch (basePath) {
    // CONTINUE: handle different base paths
    case "":
      console.debug("/home");
      break;
    case "/plans":
      console.debug("/plans");
      break;
    default:
      break;
  }
};

export default getServerSideProps;
