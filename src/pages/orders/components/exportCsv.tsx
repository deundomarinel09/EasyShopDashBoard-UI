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
  export const exportToCSV = (orders: Order[]) => {  // Explicitly type 'orders' as 'Order[]'
      // Create the CSV headers
      const headers = [
        "Order REF",
        "Name",
        "Email",
        "Date",
        "Amount",
        "Status",
      ];
  
    
      // Convert orders to CSV rows
      const rows = orders.map(order => [
        `\`${order.id}`,  
        order.customer,
        order.email,
        order.date,
        order.amount,
        order.status,
      ]);
    
      // Join everything together into a CSV string
      const csvContent = [
        headers.join(", "), // header row
        ...rows.map(row => row.join(", ")) // data rows
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
  