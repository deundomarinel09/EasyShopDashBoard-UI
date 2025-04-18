import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { generatePdf } from "./utils/pdfGenerator";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  // Mock data for reports
  const salesData = {
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
    ].slice(0, dateRange === "year" ? 12 : 6),
    datasets: [
      {
        label: "Revenue",
        data: [
          18500, 22000, 19500, 24000, 21500, 25500, 28000, 26500, 30000, 29500,
          32000, 35000,
        ].slice(0, dateRange === "year" ? 12 : 6),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const categorySalesData = {
    labels: ["Electronics", "Clothing", "Home & Garden", "Sports", "Books"],
    datasets: [
      {
        label: "Sales by Category",
        data: [35000, 25000, 20000, 15000, 5000],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(236, 72, 153, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Summary data
  const summaryData = {
    totalRevenue: 236000,
    averageOrderValue: 128.45,
    ordersCount: 1837,
    refundRate: 2.3,
    topSellingProduct: "Wireless Headphones",
    productSoldCount: 253,
  };

  const handleDownloadReport = async () => {
    setIsGenerating(true);

    try {
      let reportTitle = "Sales Report";
      if (selectedReport === "category") {
        reportTitle = "Category Sales Report";
      }

      const period = dateRange === "year" ? "Annual" : "Monthly";
      const fileName = `${reportTitle.toLowerCase().replace(" ", "_")}_${period.toLowerCase()}.pdf`;

      await generatePdf(reportTitle, period, summaryData, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case "sales":
        return (
          <div className="h-80">
            <Line
              data={salesData}
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
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(context.parsed.y);
                        }
                        return label;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return "$" + value.toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        );
      case "category":
        return (
          <div className="h-80">
            <Bar
              data={categorySalesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(context.parsed.y);
                        }
                        return label;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return "$" + value.toLocaleString();
                      },
                    },
                  },
                },
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500">
          Generate and download financial reports for your business
        </p>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
              >
                <option value="sales">Sales Report</option>
                <option value="category">Category Sales</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="month">Last 6 Months</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowSummary(!showSummary)}
            >
              <ChevronDown
                className={`h-4 w-4 mr-2 transition-transform ${showSummary ? "rotate-180" : ""}`}
              />
              {showSummary ? "Hide Summary" : "Show Summary"}
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={isGenerating}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isGenerating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              ${summaryData.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Average Order Value
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              ${summaryData.averageOrderValue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Orders
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {summaryData.ordersCount.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedReport === "sales"
            ? "Sales Overview"
            : "Category Sales Breakdown"}
        </h2>
        {renderReportContent()}
      </div>

      {/* Advanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Best Selling Products
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">
                  {summaryData.topSellingProduct}
                </p>
                <p className="text-sm text-gray-500">
                  {summaryData.productSoldCount} units sold
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                #1
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">Fitness Smartwatch</p>
                <p className="text-sm text-gray-500">187 units sold</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                #2
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">Laptop Backpack</p>
                <p className="text-sm text-gray-500">165 units sold</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                #3
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-800">Smart Home Speaker</p>
                <p className="text-sm text-gray-500">142 units sold</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                #4
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800">Portable Power Bank</p>
                <p className="text-sm text-gray-500">136 units sold</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                #5
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Key Metrics
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Refund Rate</p>
                <p className="text-sm font-semibold text-gray-900">
                  {summaryData.refundRate}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${summaryData.refundRate * 5}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Conversion Rate
                </p>
                <p className="text-sm font-semibold text-gray-900">4.8%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Customer Retention
                </p>
                <p className="text-sm font-semibold text-gray-900">68.5%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "68.5%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Cart Abandonment
                </p>
                <p className="text-sm font-semibold text-gray-900">32.1%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "32.1%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
