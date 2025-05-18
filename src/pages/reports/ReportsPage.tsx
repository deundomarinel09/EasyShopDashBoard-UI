import React, { useState, Suspense, lazy } from "react";
import SalesReportTab from "./utils/SalesReportTab";
import CategorySalesSummaryTab from "./utils/CategorySalesSummaryTab";

const InventoryReportTab = lazy(() => import("./utils/InventoryReportTab"));

const SalesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("salesReport");

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("salesReport")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "salesReport"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Sales Report
        </button>
        <button
          onClick={() => setActiveTab("categorySalesSummary")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "categorySalesSummary"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Category Sales Summary
        </button>
        <button
          onClick={() => setActiveTab("inventoryReport")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "inventoryReport"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Inventory Report
        </button>
      </div>

      {/* Render active tab */}
      {activeTab === "salesReport" && <SalesReportTab />}
      {activeTab === "categorySalesSummary" && <CategorySalesSummaryTab />}
      {activeTab === "inventoryReport" && (
        <Suspense fallback={<div>Loading Inventory Report...</div>}>
          <InventoryReportTab />
        </Suspense>
      )}
    </div>
  );
};

export default SalesDashboard;
