import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import DataTable from "./components/GenericTable";
import { capitalize } from "../../utils";

type Tab =
  | "users"
  | "roles"
  | "transactions"
  | "subscriptions"
  | "contributions";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const tables = useAppContext().globalState?.tables;
  const tableNames = Object.keys(tables);
  const dataMap = {
    users: tables?.users,
    roles: tables?.roles,
    transactions: tables?.transactions,
    subscriptions: tables?.subscriptions,
    contributions: tables?.contributions,
  };
  const handleTabChange = (tab: Tab) => {
    // change url params
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
    setActiveTab(tab as Tab);
  };

  useEffect(() => {
    // set active tab from url params
    const url = new URL(window.location.href);
    const tab = url.searchParams.get("tab") as Tab;
    if (tab) {
      setActiveTab(tab);
    }
  });
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-blue-950 text-white">
        <h1 className="text-xl p-6 font-bold mb-8">
          <a href="/">MINI ERP</a>
        </h1>
        <hr className="border-gray-700 border-1 mb-4" />

        <h2 className="text-md font-medium text-gray-400 px-3">Tables</h2>
        <ul>
          {tableNames.map((table) => (
            <li
              key={table}
              className={`px-6 py-3  ${
                activeTab === table ? "bg-blue-200 text-blue-950" : ""
              }
                cursor-pointer hover:bg-gray-500 transition duration-300 ease-in-out
                hover:text-black
                `}
              onClick={() => handleTabChange(table as Tab)}
            >
              {/* capitalize First letter */}
              {capitalize(table)}
            </li>
          ))}
        </ul>
        <hr className="border-gray-700 border-1 mb-4" />
        <div className="px-4 font-medium">
          <a href="/">&larr; Go Back Home</a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="w-4/5 p-6">
        <DataTable
          data={dataMap[activeTab] || []}
          title={`${activeTab} Table`}
        />
      </div>
    </div>
  );
};

export default Dashboard;
