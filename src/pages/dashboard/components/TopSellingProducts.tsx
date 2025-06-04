import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchItemData } from "../../api/orderApi";
import { fetchListProductData } from "../../api/productApi";

const TopSellingProducts = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopSellingData = async () => {
      setLoading(true);
      try {
        const productResponse = await fetchListProductData();
        const products = productResponse.data?.$values || [];

        const itemResponse = await fetchItemData();
        const items = itemResponse.data?.$values || [];

        const now = new Date();

        console.log("Raw items:", items);
        console.log("First item sample:", items[0]);
        console.log("Parsed item date:", new Date(items[0]?.date));

        const filteredItems = items.filter((item: any) => {
          const itemDate = new Date(item.orderDate); // <- check if 'item.date' exists and is valid
          if (isNaN(itemDate.getTime())) return false;

          const itemDay = itemDate.toISOString().slice(0, 10);
          const now = new Date();
          const today = now.toISOString().slice(0, 10);

          switch (selectedPeriod) {
            case "daily":
              return itemDay === today;

            case "weekly": {
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              startOfWeek.setHours(0, 0, 0, 0);
              return itemDate >= startOfWeek;
            }

            case "monthly":
              return (
                itemDate.getMonth() === now.getMonth() &&
                itemDate.getFullYear() === now.getFullYear()
              );

            case "quarterly": {
              const quarter = Math.floor(now.getMonth() / 3);
              const itemQuarter = Math.floor(itemDate.getMonth() / 3);
              return (
                itemQuarter === quarter &&
                itemDate.getFullYear() === now.getFullYear()
              );
            }

            case "yearly":
              return itemDate.getFullYear() === now.getFullYear();

            default:
              return true;
          }
        });

        const productSales = filteredItems.reduce((acc: any, item: any) => {
          const productId = item.productId;
          if (!acc[productId]) {
            acc[productId] = { count: 0, productId };
          }
          acc[productId].count += item.quantity;
          return acc;
        }, {});

        const topSelling = Object.values(productSales).map((salesData: any) => {
          const product = products.find(
            (p: any) => p.id === salesData.productId
          );

          const baseUrl =
            "https://wyzlpxshonuzitdcgdoe.supabase.co/storage/v1/object/public/product-images";

          const getImageFromName = (name: any) =>
            `${baseUrl}/${name.replace(/\s+/g, "")}`;

          const imageUrl =
          getImageFromName(product.name);
console.log("Image string:", imageUrl);

          return {
            ...salesData,
            name: product?.name || "Unknown Product",
            image: imageUrl || "",
            price: product?.price || 0,
          };
        });

        topSelling.sort((a: any, b: any) => b.count - a.count);
        setTopProducts(topSelling.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError("Error fetching top selling products.");
        setLoading(false);
      }
    };


    fetchTopSellingData();
  }, [selectedPeriod]);

  const handleViewAllClick = () => {
    navigate("/products");
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          Top Selling Products
        </h2>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
          {["daily", "weekly", "monthly", "quarterly", "yearly"].map(
            (period) => (
              <button
                key={period}
                className={`capitalize px-3 py-1 text-xs rounded-md transition-colors duration-150 ${
                  selectedPeriod === period
                    ? "bg-white shadow-sm font-semibold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handlePeriodChange(period)}
              >
                {period}
              </button>
            )
          )}
        </div>
      </div>

      <ul className="divide-y divide-gray-200">
        {topProducts.map((product) => (
          <li
            key={product.productId}
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center space-x-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover border"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ₱{product.price?.toFixed(2)}
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
  );
};

export default TopSellingProducts;
