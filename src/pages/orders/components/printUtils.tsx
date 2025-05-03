export const handlePrint = (contentId: string) => {
  const printContent = document.getElementById(contentId);
  if (printContent) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              @media print {
                @page {
                  size: 90mm 225mm; /* Chou 40 or receipt size */
                  margin: 5mm;
                }

                body {
                  font-family: "Courier New", monospace;
                  font-size: 12px;
                  line-height: 1.2;
                  white-space: pre;
                }

                .no-print {
                  display: none !important;
                }
              }

              body {
                font-family: "Courier New", monospace;
                padding: 5mm;
                font-size: 12px;
                white-space: pre;
              }
            </style>
          </head>
          <body>
            ${printContent.innerText}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }
};
