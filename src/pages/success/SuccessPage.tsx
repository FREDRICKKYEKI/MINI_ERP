import { useEffect, useState } from "react";

const SuccessPage = () => {
  const [success_type, setSuccessType] = useState<string | null>(null);
  useEffect(() => {
    // get the query params
    const params = new URLSearchParams(window.location.search);
    const success_type = params.get("type");
    if (success_type) {
      setSuccessType(success_type);
    }
  }, []);
  return (
    <>
      {success_type === "membership" ? (
        <h1>Membership registration successful!</h1>
      ) : (
        <h1>Success type not implemented!</h1>
      )}
    </>
  );
};

export default SuccessPage;
