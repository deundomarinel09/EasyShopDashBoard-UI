import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { saveAs } from "file-saver";
import Papa from "papaparse";

type CategorySalesSummaryItem = {
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
};

const CategorySalesSummaryTab: React.FC = () => {
  const [categorySales, setCategorySales] = useState<CategorySalesSummaryItem[]>([]);
  const [loadingCategorySales, setLoadingCategorySales] = useState(false);
  const [errorCategorySales, setErrorCategorySales] = useState<string | null>(null);

  useEffect(() => {
    setLoadingCategorySales(true);
    setErrorCategorySales(null);
    const localhost = "https://localhost:7066";
    const baseUrl = "https://mobileeasyshop.onrender.com"
    const endPoint = "/api/Reports/CategorySalesSummary";

    fetch(`${baseUrl}${endPoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        const values = data?.$values ?? data;
        setCategorySales(values);
      })
      .catch((err) => setErrorCategorySales(err.message))
      .finally(() => setLoadingCategorySales(false));
  }, []);

  const handleDownloadCategoryCSV = () => {
    const csvData = [
      ["Category Name", "Total Quantity", "Total Revenue"],
      ...categorySales.map((item) => [
        item.categoryName,
        item.totalQuantity,
        item.totalRevenue.toFixed(2),
      ]),
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "category_sales_summary.csv");
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadCategoryCSV}
          disabled={loadingCategorySales || categorySales.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition disabled:opacity-50"
        >
          Download CSV
        </button>
      </div>

      {loadingCategorySales && <p>Loading category sales summary...</p>}
      {errorCategorySales && (
        <p className="text-red-600">Error: {errorCategorySales}</p>
      )}

      {!loadingCategorySales && !errorCategorySales && categorySales.length === 0 && (
        <p>No category sales data available.</p>
      )}

      {categorySales.length > 0 && (
        <>
          <table className="w-full table-auto border mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Category Name</th>
                <th className="text-left p-2">Total Quantity</th>
                <th className="text-left p-2">Total Revenue (₱)</th>
              </tr>
            </thead>
            <tbody>
              {categorySales.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{item.categoryName}</td>
                  <td className="p-2">{item.totalQuantity}</td>
                  <td className="p-2">{item.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-white shadow rounded-2xl p-4 w-full max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">Sales by Category</h2>
            <Doughnut
              data={{
                labels: categorySales.map((item) => item.categoryName),
                datasets: [
                  {
                    data: categorySales.map((item) => item.totalRevenue),
                    backgroundColor: [
                      "#FBBF24",
                      "#34D399",
                      "#60A5FA",
                      "#A78BFA",
                      "#F87171",
                    ],
                  },
                ],
              }}
              options={{ responsive: true }}
              width={400}
              height={300}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategorySalesSummaryTab;
