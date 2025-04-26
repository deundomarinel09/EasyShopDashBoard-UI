import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import StatCard from "./components/StatCard";
import RecentOrdersTable from "./components/RecentOrdersTable";
import TopSellingProducts from "./components/TopSellingProducts";
import { fetchOrderData, updateOrderStatus, fetchItemData, fetchProductData } from "../api/orderApi";
import { useState, useEffect, useRef } from "react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: string;
  items: Array<string>;
  payment: string;
};

const DashboardPage = () => {

    const [orders, setOrders] = useState<Order[]>([]);
    const ordersRef = useRef<Order[]>([]);
  
    const fetchAndUpdateOrders = async () => {
      try {
        const response = await fetchOrderData();
        const orderArray = response.data.$values;
  
        const newData = JSON.stringify(orderArray);
        const currentData = JSON.stringify(ordersRef.current);
  
        if (newData !== currentData) {
          setOrders(orderArray);
          ordersRef.current = orderArray;
        }
      } catch (error: any) {
        console.error(`Error fetching orders: ${error}`);
      }
    };

      
  const totalCompleted = orders.reduce(
    (sum, order) => (order.status.toLowerCase() === "completed" ? sum + order.amount : sum),
    0,
  );

  const totalOrdersCount = orders.length;

  console.log("orders",orders);
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
      value: "3,427",
      change: 5.1,
      trend: "up",
      icon: Users,
      bgColor: "bg-green-500",
    },
    {
      title: "Products",
      value: "584",
      change: -2.4,
      trend: "down",
      icon: Package,
      bgColor: "bg-orange-500",
    },
  ];

  // Data for revenue chart
  const revenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [
          18500, 22000, 19500, 24000, 21500, 25500, 28000, 26500, 30000, 29500,
          32000, 35000,
        ],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Expenses",
        data: [
          10500, 12000, 11500, 13000, 12500, 14500, 15000, 14500, 16000, 15500,
          17000, 18000,
        ],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Data for sales by category chart
  const categoryData = {
    labels: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for sales channel chart
  const channelData = {
    labels: [
      "Website",
      "Mobile App",
      "Marketplace",
      "Social Media",
      "In-store",
    ],
    datasets: [
      {
        label: "Sales by Channel",
        data: [12500, 8900, 6700, 4500, 3200],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
      },
    ],
  };

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
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Revenue Overview
          </h2>
          <div className="h-80">
            <Line
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Category & Channel Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* Category Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sales by Category
            </h2>
            <div className="h-64">
              <Doughnut
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Channel Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sales by Channel
            </h2>
            <div className="h-64">
              <Bar
                data={channelData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.raw.toLocaleString()}`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm overflow-hidden">
          <RecentOrdersTable />
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
