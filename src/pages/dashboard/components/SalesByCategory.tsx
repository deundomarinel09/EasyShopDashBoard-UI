import { Chart as ChartJS, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { useEffect, useMemo } from "react";

// Register required components for Chart.js
ChartJS.register(LinearScale, ArcElement, Title, Tooltip, Legend);

// Type definitions for props (optional but recommended)
interface Product {
  id: string;
  category: string;
}

interface Item {
  productId: string;
  orderRef: string;
}

interface Order {
  id: string;
  status: string;
  amount: number;
}

interface SalesByCategoryProps {
  products: Product[];
  items: Item[];
  orders: Order[];
}

const SalesByCategory = ({ products, items, orders }: SalesByCategoryProps) => {
  const categorySales = useMemo(() => {
    return products.reduce((acc: any, product: Product) => {
      const productCategory = product.category;  // Assuming products have a category field
      const productSales = items.filter((item) => item.productId === product.id).reduce((sum: number, item: Item) => {
        const order = orders.find((order) => order.id === item.orderRef);
        return sum + (order?.status.toLowerCase() === "completed" ? order.amount : 0);
      }, 0);
      
      acc[productCategory] = (acc[productCategory] || 0) + productSales;
      return acc;
    }, {});
  }, [products, items, orders]);  // Re-compute when these change

  const categoryData = {
    labels: Object.keys(categorySales),  // Categories based on the dynamic data
    datasets: [
      {
        data: Object.values(categorySales), // Sales for each category
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

  // Return early if no sales data to display
  if (Object.keys(categorySales).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Sales by Category
        </h2>
        <p>No sales data available.</p>
      </div>
    );
  }

  return (
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
  );
};

export default SalesByCategory;
