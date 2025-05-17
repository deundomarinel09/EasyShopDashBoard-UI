import {
  Chart as ChartJS,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(LinearScale, ArcElement, Title, Tooltip, Legend);

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
  grandTotal: number;
}

interface SalesByCategoryProps {
  products: Product[];
  items: Item[];
  orders: Order[];
}

// Generate unique HSL-based color palette
const generateUniqueColors = (count: number): string[] => {
  const colors = [];
  const step = 360 / count;
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(i * step);
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

const SalesByCategory = ({ products, items, orders }: SalesByCategoryProps) => {
  const categorySales = useMemo(() => {
    return products.reduce((acc: Record<string, number>, product) => {
      const productCategory = product.category;
      const productSales = items
        .filter(item => item.productId === product.id)
        .reduce((sum, item) => {
          const order = orders.find(o => o.id === item.orderRef);
          return sum + (order?.status.toLowerCase() === "completed" ? order.grandTotal : 0);
        }, 0);
      acc[productCategory] = (acc[productCategory] || 0) + productSales;
      return acc;
    }, {});
  }, [products, items, orders]);

  const categories = Object.keys(categorySales);
  const values = Object.values(categorySales);
  const uniqueColors = generateUniqueColors(categories.length);

  const categoryData = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: uniqueColors,
        borderWidth: 1,
      },
    ],
  };

  if (categories.length === 0) {
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
