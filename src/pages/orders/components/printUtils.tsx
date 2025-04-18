// printUtils.tsx
export const handlePrint = (contentId: string) => {
    const printContent = document.getElementById(contentId);
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Order Details</title>
              <style>
                @media print {
                  .no-print {
                    display: none !important;
                  }
                }
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                }
                table {
                  border-collapse: collapse;
                  width: 100%;
                }
                th, td {
                  border: 1px solid #ccc;
                  padding: 8px;
                }
                th {
                  background-color: #f9f9f9;
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };
  