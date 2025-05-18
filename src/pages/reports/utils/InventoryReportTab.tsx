import React, { useEffect, useState } from "react";

interface InventoryReportItem {
  productId: number;
  productName: string;
  categoryName: string;
  stockQuantity: number;
  reorderLevel?: number | null;
}

const InventoryReportTab: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const localhost = "https://localhost:7066";
        const baseUrl = "https://mobileeasyshop.onrender.com"
        const endPoint = "/api/Reports/InventoryReport";
        const response = await fetch(`${baseUrl}${endPoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const json = await response.json();

        // Your sample API response seems wrapped in $values
        // Adjust accordingly if API returns { "$values": [...] }
        const data = json.$values ?? json;

        setInventoryData(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const convertToCSV = (data: InventoryReportItem[]) => {
    if (data.length === 0) return "";

    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data
      .map(item =>
        Object.values(item)
          .map(value => `"${value ?? ""}"`) // Wrap in quotes to handle commas
          .join(",")
      )
      .join("\n");
    return header + rows;
  };

  const handleDownload = () => {
    const csv = convertToCSV(inventoryData);
    if (!csv) return;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_report.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading Inventory Report...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
 <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download CSV
      </button>

      <table className="min-w-full border-collapse border border-gray-300 mb-4 mt-2">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Product ID</th>
            <th className="border border-gray-300 px-4 py-2">Product Name</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Stock Quantity</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map(({ productId, productName, categoryName, stockQuantity, reorderLevel }) => (
            <tr key={productId}>
              <td className="border border-gray-300 px-4 py-2">{productId}</td>
              <td className="border border-gray-300 px-4 py-2">{productName}</td>
              <td className="border border-gray-300 px-4 py-2">{categoryName}</td>
              <td className="border border-gray-300 px-4 py-2">{stockQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default InventoryReportTab;
