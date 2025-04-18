import { useState } from "react";
import { Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const topProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    sold: 253,
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    id: 2,
    name: "Fitness Smartwatch",
    category: "Electronics",
    price: 199.99,
    sold: 187,
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    id: 3,
    name: "Laptop Backpack",
    category: "Accessories",
    price: 59.95,
    sold: 165,
    image:
      "https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    id: 4,
    name: "Smart Home Speaker",
    category: "Electronics",
    price: 89.99,
    sold: 142,
    image:
      "https://images.pexels.com/photos/1279365/pexels-photo-1279365.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    id: 5,
    name: "Portable Power Bank",
    category: "Electronics",
    price: 49.99,
    sold: 136,
    image:
      "https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
];

const TopSellingProducts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const navigate = useNavigate();
  const handleViewAllClick = () => {
    navigate("/products");
  };
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // In a real app, you would fetch data for the selected period
  };

  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Top Selling Products
          </h2>
        </div>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors duration-150 ${
              selectedPeriod === "week"
                ? "bg-white shadow-sm"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handlePeriodChange("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors duration-150 ${
              selectedPeriod === "month"
                ? "bg-white shadow-sm"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handlePeriodChange("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors duration-150 ${
              selectedPeriod === "year"
                ? "bg-white shadow-sm"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handlePeriodChange("year")}
          >
            Year
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {topProducts.map((product) => (
            <li
              key={product.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-md overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{product.sold} sold</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={handleViewAllClick}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Products
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
