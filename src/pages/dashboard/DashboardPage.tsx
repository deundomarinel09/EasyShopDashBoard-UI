// DashboardPage.tsx

import { useState, useEffect, Suspense, lazy } from "react";
import { fetchListProductData } from "../api/productApi";
import { fetchAllUsers } from "../api/userApi";
import { fetchOrderData, fetchItemData } from "../api/orderApi";
import StatCard from "./components/StatCard";
import RecentOrdersTable from "./components/RecentOrdersTable"; // Import RecentOrdersTable
import TopSellingProducts from "./components/TopSellingProducts";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

// Dynamically import the components
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
    fetchAndUpdateItems(); // New function for fetching item data
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suspense fallback is shown while components are loading */}
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
          {/* Pass the orders to the RecentOrdersTable component */}
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
