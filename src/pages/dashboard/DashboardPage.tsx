import { useState, useEffect, Suspense, lazy } from "react";
import { fetchListProductData } from "../api/productApi";
import { fetchAllUsers } from "../api/userApi";
import { fetchOrderData, fetchItemData } from "../api/orderApi";
import StatCard from "./components/StatCard";
import RecentOrdersTable from "./components/RecentOrdersTable"; 
import TopSellingProducts from "./components/TopSellingProducts";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import Papa from "papaparse"; // Import papaparse for CSV generation

const RevenueOverview = lazy(() => import("./components/RevenueOverview"));
const SalesByCategory = lazy(() => import("./components/SalesByCategory"));

const DashboardPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchAndUpdateOrders();
    fetchAndUpdateCustomers();
    fetchAndUpdateProducts();
    fetchAndUpdateItems();
  }, []);

  const fetchAndUpdateItems = async () => {
    try {
      const response = await fetchItemData();
      const itemArray = response.data.$values;
      setItems(itemArray);
    } catch (error: any) {
      alert(`Error fetching items: ${error}`);
    }
  };

  const fetchAndUpdateProducts = async () => {
    try {
      const response = await fetchListProductData();
      const productArray = response.data.$values;
      setProducts(productArray);
    } catch (error: any) {
      alert(`Error fetching products: ${error}`);
    }
  };

  const fetchAndUpdateCustomers = async () => {
    try {
      const response = await fetchAllUsers();
      const customerArray = response.$values;
      setCustomers(customerArray);
    } catch (error: any) {
      alert(`Error fetching customers: ${error}`);
    }
  };

  const fetchAndUpdateOrders = async () => {
    try {
      const response = await fetchOrderData();
      const orderArray = response.data.$values;
      setOrders(orderArray);
    } catch (error: any) {
      alert(`Error fetching orders: ${error}`);
    }
  };

  const totalCompleted = orders?.reduce(
    (sum, order) => (order.status.toLowerCase() === "completed" ? sum + order.amount : sum),
    0,
  );

  const totalOrdersCount = orders?.length;

  console.log("orders",orders);
  // CSV Download Function (with manual CSV generation)
  const handleDownloadCSV = () => {
    const data = orders.map((order) => ({
      OrderID: order.id,
      Customer: typeof order.customer === "object" && order.customer !== null
      ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
      : String(order.customer || ""),
          Status: order.status,
      Amount: order.amount,
      ShippingFee: order.shippingFee,
      Total: order.amount + (order.shippingFee || 0),
      Date: new Date(order.date).toLocaleDateString(),
    }));

    console.log("Data to export:", data); // Debugging: check data structure

    // Create CSV string manually

    const escapeCsv = (value: string | number) => {
      const str = String(value).replace(/"/g, '""');
      if (typeof value === "number" && value > 1e11) {
        // Format large numbers so Excel treats them as text
        return `"=""${str}"""`;
      }
      return `"${str}"`;
    };
    
    

    const header = ["OrderID", "Customer", "Status", "Amount", "ShippingFee", "Total", "Date"];
  const rows = data.map((row) => [
    escapeCsv(`'${row.OrderID}`),
    escapeCsv(row.Customer),
    escapeCsv(row.Status),
    escapeCsv(row.Amount),
    escapeCsv(row.ShippingFee),
    escapeCsv(row.Total),
    escapeCsv(row.Date),
  ]);

  console.log("rows",rows);
    // Combine header and rows into CSV
    const csvContent = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");

    // Create a Blob and trigger the download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders_report.csv";
    a.click();
  };

  // Mock data for statistics
  const stats = [
    {
      title: "Total Revenue",
      value: `₱ ${totalCompleted}`,
      change: 12.5,
      trend: "up",
      icon: DollarSign,
      bgColor: "bg-blue-500",
    },
    {
      title: "Orders",
      value: `${totalOrdersCount}`,
      change: 8.2,
      trend: "up",
      icon: ShoppingCart,
      bgColor: "bg-purple-500",
    },
    {
      title: "Customers",
      value: `${customers?.length}`,
      change: 5.1,
      trend: "up",
      icon: Users,
      bgColor: "bg-green-500",
    },
    {
      title: "Products",
      value: `${products?.length}`,
      change: -2.4,
      trend: "down",
      icon: Package,
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your store overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* Button to download CSV */}
      <div>
        <button 
          onClick={handleDownloadCSV} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download Orders Report
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading Revenue Overview...</div>}>
          <RevenueOverview orders={orders} />
        </Suspense>

        <Suspense fallback={<div>Loading Sales by Category...</div>}>
          <SalesByCategory products={products} items={items} orders={orders} />
        </Suspense>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden">
          <RecentOrdersTable orders={orders} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
