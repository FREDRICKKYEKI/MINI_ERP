import { useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { TransactionType } from "../../types";

const SuccessPage = () => {
  const transaction = useAppContext().globalState
    ?.transaction as TransactionType;

  // if no transaction is found, redirect to home page
  if (!transaction) {
    useEffect(() => {
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }, []);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">
            🚫 No transaction found!
          </h1>
          <div className="text-center text-gray-500 mt-4">
            Redirecting in 3 seconds...
          </div>
        </div>
      </div>
    );
  }

  const successMessage: { [key: string]: string } = {
    subscription: "Thank you for subscribing !",
    contribution: "Thank you for your contribution !",
    default: "Success type not implemented!",
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">
            <br /> {successMessage[transaction.transaction_type || "default"]}{" "}
            🎉
          </h1>
          <hr className="my-2" />
          <div className="p-5">
            <p>
              <b>Transaction Id:</b> {transaction.id}
            </p>
            <p>
              <b>Amount: KSH</b> {transaction.amount}
            </p>
            <p>
              <b>Transaction Type:</b> {transaction.transaction_type}
            </p>
          </div>
          <hr className="my-2" />
          <p className="font-medium">
            &larr; Go back to{" "}
            <a href="/" className="underline text-blue-500">
              Home
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
