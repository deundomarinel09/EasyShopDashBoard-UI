// exportCsv.ts

// Defining the type for orders
type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: string;
  items: Array<string>;
};
  
// Export function with typed orders
export const exportToCSV = (orders: Order[]) => {  
  // Create the CSV headers
  const headers = [
    "Order REF",
    "Name",
    "Email",
    "Date",
    "Amount",
    "Status",
  ];
  
  // Function to escape a CSV field
  const escapeCsv = (value: string | number) => {
    // Replace any double quotes with two double quotes
    const str = String(value ?? "").replace(/"/g, '""');
    if (typeof value === "number" && value > 1e11) {
      // Format large numbers so Excel treats them as text
      return `"=""${str}"""`;
    }
    return `"${str}"`;
  };
    
  // Convert orders to CSV rows
  const rows = orders.map(order => [
    escapeCsv(`'${order.id}`),  // You can force text output if needed
    escapeCsv(order.customer),
    escapeCsv(order.email),
    escapeCsv(order.date),
    escapeCsv(order.amount),
    escapeCsv(order.status),
  ]);
    
  // Join everything together into a CSV string without extra spaces after commas
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  // Get the current date and format it as MMddyy
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');  
  const day = String(currentDate.getDate()).padStart(2, '0');
  const year = String(currentDate.getFullYear()).slice(-2); 
    
  // Create the dynamic file name
  const fileName = `easysho${month}${day}${year}.csv`;
  
  // Create a Blob and link it for download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Create a URL for the blob and initiate the download
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
