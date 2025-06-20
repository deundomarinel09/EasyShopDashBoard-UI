import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { saveAs } from "file-saver";
import Papa from "papaparse";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface SalesReportItem {
  orderRef: string;
  customer: string;
  orderDate: string;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface SalesSummary {
  totalOrders: number;
  totalItemsSold: number;
  totalSales: number;
  totalDeliveryFees: number;
  items: SalesReportItem[];
}

const DailyReportTab: React.FC = () => {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const test = "https://localhost:7066";
        const baseUrl = "https://mobileeasyshop.onrender.com";
        const endPoint = "/api/Reports/DailyReport";
        const res = await fetch(`${baseUrl}${endPoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        const data = await res.json();
        const items: SalesReportItem[] = data.items?.$values ?? data.items ?? [];
        setSummary({
          totalOrders: data.totalOrders,
          totalItemsSold: data.totalItemsSold,
          totalSales: data.totalSales,
          totalDeliveryFees: data.totalDeliveryFees,
          items,
        });
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, []);

  if (loading) return <div>Loading Sales Report...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!summary) return null;

  const avgOrderValue =
    summary.totalOrders > 0 ? summary.totalSales / summary.totalOrders : 0;

  const productSalesMap = new Map<string, number>();
  const categorySalesMap = new Map<string, number>();
const currentYear = new Date().getFullYear();

const monthLabels: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Ensure months are prefilled with 0 for the chart
const salesByMonthMap: Map<string, number> = new Map();
monthLabels.forEach((month) => {
  const label = `${month} ${currentYear}`;
  salesByMonthMap.set(label, 0);
});

// Aggregate sales data per month
summary.items.forEach((item) => {
  const date = new Date(item.orderDate);
  const itemYear = date.getFullYear();
  const itemMonth = date.toLocaleString("default", { month: "short" });

  const label = `${itemMonth} ${itemYear}`;
  if (itemYear === currentYear && salesByMonthMap.has(label)) {
    salesByMonthMap.set(label, (salesByMonthMap.get(label) || 0) + item.totalAmount);
  }
});

  summary.items.forEach((item) => {
    productSalesMap.set(
      item.productName,
      (productSalesMap.get(item.productName) || 0) + item.quantity
    );

    categorySalesMap.set(
      item.categoryName,
      (categorySalesMap.get(item.categoryName) || 0) + item.totalAmount
    );

    const date = new Date(item.orderDate);
    const monthLabel = date.toLocaleString("default", { month: "short", year: "numeric" });
    salesByMonthMap.set(
      monthLabel,
      (salesByMonthMap.get(monthLabel) || 0) + item.totalAmount
    );
  });

  const topProductEntry = [...productSalesMap.entries()].sort((a, b) => b[1] - a[1])[0] || ["-", 0];

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            const csvData = [
              ["Metric", "Value"],
              ["Total Revenue", summary.totalSales.toFixed(2)],
              ["Orders Count", summary.totalOrders],
              ["Total Items Sold", summary.totalItemsSold],
              ["Delivery Fees", summary.totalDeliveryFees.toFixed(2)],
              ["Average Order Value", avgOrderValue.toFixed(2)],
              ["Top Product", topProductEntry[0]],
              ["Units Sold (Top Product)", topProductEntry[1]],
            ];

            const csv = Papa.unparse(csvData);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "sales_summary.csv");
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Download Summary CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: `₱${summary.totalSales.toFixed(2)}` },
          { label: "Orders Count", value: summary.totalOrders },
          { label: "Items Sold", value: summary.totalItemsSold },
          { label: "Delivery Fees", value: `₱${summary.totalDeliveryFees.toFixed(2)}` },
          { label: "Avg Order Value", value: `₱${avgOrderValue.toFixed(2)}` },
          { label: "Top Product", value: topProductEntry[0] },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow rounded-2xl p-4">
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="text-lg font-semibold">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
        {productSalesMap.size === 0 ? (
          <p>No product sales data available.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Product</th>
                <th className="text-left p-2">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {[...productSalesMap.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([name, sold], i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{name}</td>
                    <td className="p-2">{sold}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-2">Daily Sales</h2>
          <Line
            data={{
              labels: [...salesByMonthMap.keys()],
              datasets: [
                {
                  label: "Revenue",
                  data: [...salesByMonthMap.values()],
                  borderColor: "#4F46E5",
                  backgroundColor: "#C7D2FE",
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
                tooltip: { mode: "index", intersect: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        <div className="bg-white shadow rounded-2xl p-4">
          <h2 className="text-lg font-semibold mb-2">Sales by Category</h2>
          <Doughnut
            data={{
              labels: [...categorySalesMap.keys()],
              datasets: [
                {
                  data: [...categorySalesMap.values()],
                  backgroundColor: [
                    "#FBBF24", "#34D399", "#60A5FA", "#F87171", "#A78BFA", "#FCD34D", "#6EE7B7", "#93C5FD"
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default DailyReportTab;
