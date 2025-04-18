import { jsPDF } from "jspdf";
import "jspdf-autotable";

type SummaryData = {
  totalRevenue: number;
  averageOrderValue: number;
  ordersCount: number;
  refundRate: number;
  topSellingProduct: string;
  productSoldCount: number;
};

export const generatePdf = async (
  reportTitle: string,
  period: string,
  summaryData: SummaryData,
  fileName: string,
): Promise<void> => {
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set base font
  doc.setFont("helvetica");

  // Add title
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text(reportTitle, 20, 20);

  // Add period
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`${period} Report - ${new Date().toLocaleDateString()}`, 20, 30);

  // Add summary section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Summary", 20, 45);

  // Add summary data
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);

  // Format currency
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Summary table
  (doc as any).autoTable({
    startY: 50,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatter.format(summaryData.totalRevenue)],
      ["Average Order Value", formatter.format(summaryData.averageOrderValue)],
      ["Orders Count", summaryData.ordersCount.toLocaleString()],
      ["Refund Rate", `${summaryData.refundRate}%`],
      ["Top Selling Product", summaryData.topSellingProduct],
      [
        "Units Sold (Top Product)",
        summaryData.productSoldCount.toLocaleString(),
      ],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
    },
  });

  // Add monthly data section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Monthly Revenue Data", 20, 110);

  // Sample monthly data
  const monthlyData = [
    ["January", formatter.format(18500)],
    ["February", formatter.format(22000)],
    ["March", formatter.format(19500)],
    ["April", formatter.format(24000)],
    ["May", formatter.format(21500)],
    ["June", formatter.format(25500)],
    ["July", formatter.format(28000)],
    ["August", formatter.format(26500)],
    ["September", formatter.format(30000)],
    ["October", formatter.format(29500)],
    ["November", formatter.format(32000)],
    ["December", formatter.format(35000)],
  ];

  // Monthly data table
  (doc as any).autoTable({
    startY: 115,
    head: [["Month", "Revenue"]],
    body: monthlyData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
    },
  });

  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `EasyShopDash - Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
  }

  // Save the PDF
  doc.save(fileName);
};
