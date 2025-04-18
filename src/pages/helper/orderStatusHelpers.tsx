// utils/orderStatusHelpers.ts
import { CheckCircle, Package, TruckIcon, Clock, XCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "Processing":
      return <Package className="h-5 w-5 text-blue-500" />;
    case "Shipped":
      return <TruckIcon className="h-5 w-5 text-purple-500" />;
    case "Pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "Cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
