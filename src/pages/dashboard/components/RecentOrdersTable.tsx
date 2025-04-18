import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const recentOrders = [
  {
    id: "ORD-7352",
    customer: "John Smith",
    date: "2025-01-25",
    amount: 125.99,
    status: "Completed",
    email: "john.s@example.com",
  },
  {
    id: "ORD-7351",
    customer: "Mary Johnson",
    date: "2025-01-24",
    amount: 249.99,
    status: "Processing",
    email: "mary.j@example.com",
  },
  {
    id: "ORD-7350",
    customer: "Robert Williams",
    date: "2025-01-24",
    amount: 79.95,
    status: "Completed",
    email: "rob.w@example.com",
  },
  {
    id: "ORD-7349",
    customer: "Lisa Brown",
    date: "2025-01-23",
    amount: 189.5,
    status: "Pending",
    email: "lisa.b@example.com",
  },
  {
    id: "ORD-7348",
    customer: "Michael Davis",
    date: "2025-01-22",
    amount: 299.99,
    status: "Completed",
    email: "michael.d@example.com",
  },
];

const RecentOrdersTable = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const navigate = useNavigate();
  const handleViewAllClick = () => {
    navigate("/orders");
  };

  const filteredOrders =
    selectedStatus === "All"
      ? recentOrders
      : recentOrders.filter((order) => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        <div>
          <select
            className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.customer}</div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${order.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 flex items-center justify-end space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-200 text-center">
        <button
          onClick={handleViewAllClick}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
