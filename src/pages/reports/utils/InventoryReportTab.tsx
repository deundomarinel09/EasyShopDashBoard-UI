import React, { useEffect, useState } from "react";

interface InventoryReportItem {
  productId: number;
  productName: string;
  categoryName: string;
  stockQuantity: number;
  quantitySold: number;
  reorderLevel?: number | null;
}

const InventoryReportTab: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryReportItem[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryReportItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = "https://mobileeasyshop.onrender.com";
        const test = "https://localhost:7066"
        const endPoint = "/api/Reports/InventoryReport";
          const response = await fetch(`${baseUrl}${endPoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const json = await response.json();
        const data: InventoryReportItem[] = json.$values ?? json;

        setInventoryData(data);
        setFilteredData(data);

        const uniqueCategories = Array.from(new Set(data.map((item) => item.categoryName)));
        setCategories(uniqueCategories);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (value === "All") {
      setFilteredData(inventoryData);
    } else {
      setFilteredData(inventoryData.filter((item) => item.categoryName === value));
    }
  };

  const convertToCSV = (data: InventoryReportItem[]) => {
    if (data.length === 0) return "";

    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data
      .map((item) =>
        Object.values(item)
          .map((value) => `"${value ?? ""}"`)
          .join(",")
      )
      .join("\n");
    return header + rows;
  };

  const handleDownload = () => {
    const csv = convertToCSV(filteredData);
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
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download CSV
        </button>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 mb-4 mt-2">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Product ID</th>
            <th className="border border-gray-300 px-4 py-2">Product Name</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Stock Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Quantity Sold</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(
            ({ productId, productName, categoryName, stockQuantity, quantitySold }) => (
              <tr key={productId}>
                <td className="border border-gray-300 px-4 py-2">{productId}</td>
                <td className="border border-gray-300 px-4 py-2">{productName}</td>
                <td className="border border-gray-300 px-4 py-2">{categoryName}</td>
                <td className="border border-gray-300 px-4 py-2">{stockQuantity}</td>
                <td className="border border-gray-300 px-4 py-2">{quantitySold}</td>

              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryReportTab;
