import { FC } from "react";
import { capitalize } from "../../../utils";

interface DataTableProps {
  data: any[];
  title: string;
}
const DataTable: FC<DataTableProps> = ({ data, title }) => {
  // If no data is provided, render a message
  if (!data || data.length === 0) {
    return <p>{capitalize(title)} table is empty.</p>;
  }

  // Get the keys from the first object to use as table headers
  const headers = Object.keys(data[0]);

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">{capitalize(title)}</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="py-2 px-4 border-b border-gray-300 text-left text-gray-700 font-medium"
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <Row row={row} headers={headers} key={rowIndex} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

interface RowProps {
  row: any;
  headers: string[];
}
const Row: FC<RowProps> = ({ row, headers }) => {
  if (!row) {
    return null;
  }
  return (
    <tr>
      {headers.map((header, index) => (
        <td
          key={index}
          className="py-2 px-4 border-b border-gray-300 text-gray-700"
          title={String(row[header])}
        >
          {/* shorten it */}
          {String(row[header]).length > 12
            ? `${String(row[header]).slice(0, 12)}...`
            : row[header]}
        </td>
      ))}
    </tr>
  );
};
