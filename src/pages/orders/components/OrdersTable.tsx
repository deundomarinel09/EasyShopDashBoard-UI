import { Eye } from "lucide-react";
import { getStatusIcon, getStatusColor } from "../../helper/orderStatusHelpers";

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: string;
  items: Array<string>;
};

type OrdersTableProps = {
  filteredOrders: Order[];
  onViewClick: (order: Order) => void;
};

const OrdersTable = ({ filteredOrders, onViewClick }: OrdersTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Order REF",
                "Name",
                "Email",
                "Date",
                "Amount",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <p>{order.customer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <p>{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      onClick={() => onViewClick(order)}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
