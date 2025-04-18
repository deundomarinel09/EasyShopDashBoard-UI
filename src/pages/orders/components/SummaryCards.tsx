// src/components/SummaryCards.tsx (or wherever your components are stored)

import { CircleDollarSign } from "lucide-react";

interface SummaryCardsProps {
  totalAmount: number;
  pendingAmount: number;
  refundedAmount: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalAmount,
  pendingAmount,
  refundedAmount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Processed */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <CircleDollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Processed</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 mr-4">
            <CircleDollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {pendingAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Refunded */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <CircleDollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Refunded</p>
            <p className="text-2xl font-bold text-gray-900">
              {refundedAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
