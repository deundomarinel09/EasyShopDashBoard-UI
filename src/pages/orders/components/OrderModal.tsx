import { handlePrint } from "./printUtils";
import React, { useEffect, useState } from "react";

interface OrderModalProps {
  isModalOpen: boolean;
  selectedOrder: any;
  updatedStatus: string;
  statusOptions: string[];
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSave: (shippingFee: number | "") => void;
  closeModal: () => void;
  items: any[];
  products: any[];
}

const OrderModal: React.FC<OrderModalProps> = ({
  isModalOpen,
  selectedOrder,
  updatedStatus,
  statusOptions,
  handleStatusChange,
  handleSave,
  closeModal,
  items,
  products,
}) => {
  const [localStatus, setLocalStatus] = useState("");
  const [shippingFee, setShippingFee] = useState<number | "">("");

  useEffect(() => {
    if (selectedOrder) {
      setLocalStatus(selectedOrder.status);
      setShippingFee(selectedOrder.shippingFee ?? "");
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (localStatus !== selectedOrder?.status) {
      handleStatusChange({
        target: { value: localStatus },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [localStatus, selectedOrder, handleStatusChange]);

  const calculatedShipping = selectedOrder?.shippingFee ?? 0;
  const itemsTotal = selectedOrder?.amount ?? 0;
  const grandTotal = itemsTotal + calculatedShipping;

  return (
    <>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all duration-300">
          <div className="bg-white rounded-lg p-8 sm:p-12 w-full max-w-3xl shadow-xl transform transition-all scale-95 hover:scale-100">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Order Details
            </h2>

            <div id="order-modal-content" className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>ORDER REF:</strong> {selectedOrder?.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Customer:</strong> {selectedOrder?.customer}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {selectedOrder?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder?.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {selectedOrder?.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Items Total Amount:</strong> ₱
                    {itemsTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Shipping Fee:</strong> ₱
                    {calculatedShipping.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold">
                    <strong>Grand Total:</strong> ₱{grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-6 no-print">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Update Status
                </label>
                {localStatus === "Cancelled" ? (
                  <p className="text-sm font-semibold text-red-600">Cancelled</p>
                ) : (
                  <select
                    id="status"
                    value={localStatus}
                    onChange={(e) => setLocalStatus(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions
                      .filter((status) => status !== "Cancelled")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                )}

                {localStatus === "Processing" || localStatus === "Pending" ? (
                  <div className="mt-4">
                    <label
                      htmlFor="shippingFee"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Shipping Fee (₱)
                    </label>
                    <input
                      type="number"
                      id="shippingFee"
                      value={shippingFee}
                      onChange={(e) =>
                        setShippingFee(parseFloat(e.target.value))
                      }
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                ) : (
                  <div className="mt-4">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Shipping Fee (₱)
                    </label>
                    <div className="text-gray-800 font-semibold">
                      ₱{calculatedShipping.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full text-sm text-left text-gray-700 border">
                  <thead className="bg-gray-100 text-xs uppercase font-medium">
                    <tr>
                      <th className="px-4 py-2 border">Item Name</th>
                      <th className="px-4 py-2 border">Description</th>
                      <th className="px-4 py-2 border">Unit Price</th>
                      <th className="px-4 py-2 border">Quantity</th>
                      <th className="px-4 py-2 border">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items
                      .filter((item) => item.orderRef === selectedOrder?.id)
                      .map((item, index) => {
                        const product = products.find(
                          (p) => p.id === item.productId
                        );
                        const unitPrice = product?.price || 0;
                        const subtotal = unitPrice * item.quantity;

                        return (
                          <tr
                            key={index}
                            className="bg-white hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-2 border">
                              {product?.name || "Unknown"}
                            </td>
                            <td className="px-4 py-2 border">
                              {product?.description || "No description"}
                            </td>
                            <td className="px-4 py-2 border">
                              ₱{unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 border">{item.quantity}</td>
                            <td className="px-4 py-2 border">
                              ₱{subtotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Signature Section - Print only */}
              <div className="mt-12 print:mt-24 border-t pt-6 print:block hidden">
                <p className="text-sm text-gray-700 mb-4">Customer Signature:</p>
                <div
                  style={{
                    height: "80px",
                    borderBottom: "1px solid #000",
                    width: "300px",
                  }}
                ></div>
                <p className="text-sm text-gray-600 mt-2">
                  Signature Over Printed Name
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 no-print">
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  onClick={closeModal}
                >
                  Close
                </button>

                <button
                  onClick={() => handlePrint("print-content")}
                  className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Print Receipt
                </button>

                <button
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  onClick={() => {
                    handleSave(shippingFee);
                    if (localStatus === "Shipped") {
                      setTimeout(() => {
                        handlePrint("print-content");
                      }, 300);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<div id="print-content" style={{ display: "none" }}>
  <pre style={{ fontFamily: "monospace", fontSize: "12px" }}>
{`
MARITON GROCERY
Tuguegarao City, Region II 3500
VAT-REG-TIN: 005-900-881-003

REGULAR TRANSACTION
-------------------------
${items
  .filter((item) => item.orderRef === selectedOrder?.id)
  .map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = product?.price || 0;
    const subtotal = unitPrice * item.quantity;
    return `${product?.name?.slice(0, 20).padEnd(20)}\n ${item.quantity} @ ₱${unitPrice.toFixed(2)}       ₱${subtotal.toFixed(2)}\n`;
  })
  .join("")}
-------------------------
TOTAL:         ₱${itemsTotal.toFixed(2)}
SHIPPING FEE:  ₱${calculatedShipping.toFixed(2)}
GRAND TOTAL:   ₱${grandTotal.toFixed(2)}
 
Date: ${new Date(selectedOrder?.date).toLocaleDateString()}
Customer Signature: _______________________
`}
  </pre>
</div>

    </>
  );
};

export default OrderModal;
