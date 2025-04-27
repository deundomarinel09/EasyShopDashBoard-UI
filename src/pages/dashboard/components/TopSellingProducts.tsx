import { useState, useEffect } from "react";
import { Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchItemData } from "../../api/orderApi"; // Fetch items from the orders
import { fetchListProductData } from "../../api/productApi"; // Fetch all products

const TopSellingProducts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch product sales data dynamically based on selected period
  useEffect(() => {
    const fetchTopSellingData = async () => {
      try {
        // Fetch all product details
        const productResponse = await fetchListProductData();
        const products = productResponse.data?.$values || []; // List of all products

        // Fetch order items (the 'values' array inside the response)
        const itemResponse = await fetchItemData();
        const items = itemResponse.data?.$values || []; // Accessing the '$values' array

        // Calculate total sales for each product based on productId and quantity
        const productSales = items.reduce((acc: any, item: any) => {
          const productId = item.productId;
          if (!acc[productId]) {
            acc[productId] = { count: 0, productId: productId };
          }
          acc[productId].count += item.quantity; // Assuming item.quantity is the quantity sold
          return acc;
        }, {});

        // Map the sales data with the product details
        const topSellingProducts = Object.values(productSales).map((salesData: any) => {
          const product = products.find((prod: any) => prod.id === salesData.productId);
          return {
            ...salesData,
            name: product?.name || "Unknown Product",
            image: product?.image || "",
            price: product?.price || 0,
          };
        });

        // Sort products by sales count in descending order and limit to top 5
        topSellingProducts.sort((a: any, b: any) => b.count - a.count);
        setTopProducts(topSellingProducts.slice(0, 5)); // Only top 5 products
        setLoading(false);
      } catch (err: any) {
        setError("Error fetching products. Please try again.");
        setLoading(false);
      }
    };

    fetchTopSellingData();
  }, [selectedPeriod]);

  // Handle View All click
  const handleViewAllClick = () => {
    navigate("/products");
  };

  // Handle period change (week, month, year)
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-800">Top Selling Products</h2>
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
              key={product.productId}
              className="p-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center space-x-4">
               
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                  ₱{product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{product.count} sold</p>
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
