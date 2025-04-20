// src/components/SummaryCards.tsx

import { CircleDollarSign } from "lucide-react";

interface SummaryCardsProps {
  totalPending: number;
  totalProcessing: number;
  totalShipped: number;
  totalCompleted: number;
  totalCancelled: number;
  grandTotal: number;
}

const getStatusColors = (status: string) => {
  switch (status) {
    case "Pending":
      return { bg: "bg-yellow-100", text: "text-yellow-600" };
    case "Processing":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "Shipped":
      return { bg: "bg-purple-100", text: "text-purple-600" };
    case "Completed":
      return { bg: "bg-green-100", text: "text-green-600" };
    case "Cancelled":
      return { bg: "bg-red-100", text: "text-red-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
};

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalPending,
  totalProcessing,
  totalShipped,
  totalCompleted,
  totalCancelled,
  grandTotal,
}) => {
  const statusCards = [
    { label: "Pending", total: totalPending },
    { label: "Processing", total: totalProcessing },
    { label: "Shipped", total: totalShipped },
    { label: "Completed", total: totalCompleted },
    { label: "Cancelled", total: totalCancelled },
  ];

  return (
    <div className="space-y-6">
      {/* Grand Total */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-black/10 mr-4">
            <CircleDollarSign className="h-6 w-6 text-black" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Grand Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {grandTotal?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statusCards.map(({ label, total }) => {
          const { bg, text } = getStatusColors(label);
          return (
            <div key={label} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${bg} mr-4`}>
                  <CircleDollarSign className={`h-6 w-6 ${text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total {label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {total?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCards;
