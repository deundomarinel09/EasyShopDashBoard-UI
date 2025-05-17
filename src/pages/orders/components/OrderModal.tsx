import { handlePrint } from "./printUtils";
import React, { useEffect, useState } from "react";

interface OrderModalProps {
  isModalOpen: boolean;
  selectedOrder: any;
  updatedStatus: string;
  statusOptions: string[];
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSave: () => void;
  closeModal: () => void;
  items: any[];
  products: any[];
}

function wrapText(text: string, maxLength: number) {
  const regex = new RegExp(`(.{1,${maxLength}})(\\s+|$)`, "g");
  return text.match(regex)?.join("\n") ?? text;
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

  const statusFlow = ["Pending", "Processing", "Shipped", "Completed"];

  useEffect(() => {
    if (selectedOrder) {
      setLocalStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (localStatus !== selectedOrder?.status) {
      handleStatusChange({
        target: { value: localStatus },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [localStatus, selectedOrder, handleStatusChange]);

  const distanceTotal = selectedOrder?.distanceDeliveryFee ?? 0;
  const weightTotal = selectedOrder?.weightDeliveryFee ?? 0;
  const itemsTotal = selectedOrder?.itemsBaseFee ?? 0;
  const grandTotal = selectedOrder?.grandTotal ?? 0;


  console.log("selected order",selectedOrder);
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
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {selectedOrder?.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Delivery instruction:</strong> {selectedOrder?.instruction}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder?.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Current Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        selectedOrder?.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedOrder?.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : selectedOrder?.status === "Shipped"
                          ? "bg-purple-100 text-purple-800"
                          : selectedOrder?.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedOrder?.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedOrder?.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Distance Fee:</strong> ₱
                    {distanceTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Weight Delivery Fee:</strong> ₱
                    {weightTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Items Total Amount:</strong> ₱
                    {itemsTotal.toFixed(2)}
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
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const currentIndex = statusFlow.indexOf(selectedOrder?.status);
                      const allowedStatuses = statusFlow.slice(currentIndex + 1);
                      return allowedStatuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            if (
                              statusFlow.indexOf(status) >
                              statusFlow.indexOf(localStatus)
                            ) {
                              setLocalStatus(status);
                            }
                          }}
                          className={`px-4 py-2 rounded-md text-sm font-medium border ${
                            localStatus === status
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {status}
                        </button>
                      ));
                    })()}
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
                    handleSave();
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
EASY SHOP
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
ITEMS TOTAL:        ₱${itemsTotal.toFixed(2)}
DISTANCE FEE:       ₱${distanceTotal.toFixed(2)}
WEIGHT FEE:         ₱${weightTotal.toFixed(2)}

GRAND TOTAL:   ₱${grandTotal.toFixed(2)}
 
Date: ${new Date(selectedOrder?.date).toLocaleDateString()}
Customer Signature: _______________________


Address: ${wrapText(selectedOrder?.address || "N/A", 40)}

Delivery Instruction: ${wrapText(selectedOrder?.instruction || "N/A", 40)}
`}
        </pre>
      </div>
    </>
  );
};

export default OrderModal;
