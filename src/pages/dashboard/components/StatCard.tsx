import { TrendingUp as Trend } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatProps = {
  stat: {
    title: string;
    value: string;
    change: number;
    trend: "up" | "down";
    icon: typeof Trend;
    bgColor: string;
  };
};

const StatCard = ({ stat }: StatProps) => {
  const { title, value, change, trend, icon: Icon, bgColor } = stat;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform duration-300 hover:shadow-md hover:scale-102">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} text-white mr-4`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <div
          className={`flex items-center ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >    
        </div>
      </div>
    </div>
  );
};

export default StatCard;
