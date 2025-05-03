import { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, ArcElement, Title, Tooltip, Legend, CategoryScale, PointElement, LineElement } from 'chart.js';
import { Line } from "react-chartjs-2";

// Register required components
ChartJS.register(
  LinearScale, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  PointElement,
  LineElement
);

const RevenueOverview = ({ orders }: { orders: any[] }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const monthlyRevenue = Array(12).fill(0);

    orders
      .filter((order) => order.status.toLowerCase() === "completed")
      .forEach((order) => {
        const month = new Date(order.date).getMonth();
        monthlyRevenue[month] += order.amount;
      });

    setChartData({
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      datasets: [
        {
          label: "Revenue",
          data: monthlyRevenue,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    });
  }, [orders]);

  useEffect(() => {
    return () => {
      // Cleanup previous charts if necessary
      if (chartData) {
        const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
        if (canvas) {
          const chartInstance = ChartJS.getChart(canvas);
          if (chartInstance) {
            chartInstance.destroy(); // Destroy the existing chart instance
          }
        }
      }
    };
  }, [chartData]);

  if (!chartData) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Revenue Overview
      </h2>
      <div className="h-80">
        <Line
          data={chartData}
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
              x: {
                type: "category", // Explicitly using the category scale
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `₱${value.toLocaleString()}`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RevenueOverview;
