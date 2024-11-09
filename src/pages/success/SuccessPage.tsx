import { useEffect, useState } from "react";

const SuccessPage = () => {
  const [success_type, setSuccessType] = useState<string | null>("default");
  useEffect(() => {
    // get the query params
    const params = new URLSearchParams(window.location.search);
    const success_type = params.get("type");
    // show all the query params parsed
    for (const [key, value] of params.entries()) {
      console.log(key, ": ", value);
    }
    if (success_type) {
      setSuccessType(success_type);
    }
  }, []);

  const successMessage: { [key: string]: string } = {
    membership: "Membership registration successful!",
    contribution: "Contribution successful!",
    default: "Success type not implemented!",
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">
            🎉
            <br /> {successMessage[success_type as string]}
            {/* tick */}
          </h1>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
