import React from "react";
import { handlePrint } from "./printUtils"; // Import the print utility

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

  
  const isSaveEnabled =
  (updatedStatus !== "Pending" &&
  updatedStatus !== "Processing" &&
  selectedOrder?.status !== "Pending") ||
  updatedStatus === "Cancelled"; 


  return (
    <>
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all duration-300">
          <div className="bg-white rounded-lg p-12 w-full max-w-3xl shadow-xl transform transition-all scale-95 hover:scale-100">
            {/* Print Button - visible only when status is "Processing" */}
            {updatedStatus === "Processing" ? (
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1 no-print">
                <button
                  onClick={() => handlePrint("order-modal-content")}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
                >
                  Print
                </button>
                <span className="text-xs text-gray-500">
                  * Available when status is "Processing"
                </span>
              </div>
            ) : (
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1 no-print">
                <button
                  disabled
                  className="p-2 bg-gray-300 text-white rounded-full cursor-not-allowed"
                >
                  Print
                </button>
                <span className="text-xs text-red-500">
                  * Print is only available when status is "Processing"
                </span>
              </div>
            )}

            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Order Details
            </h2>

            <div id="order-modal-content" className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4">
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
                    <strong>TOTAL Amount:</strong> ₱{selectedOrder?.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="mt-6 no-print">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Update Status
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={updatedStatus}
                  onChange={handleStatusChange}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Items table */}
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
                          <tr key={index} className="bg-white hover:bg-gray-50">
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

              {/* Action buttons */}
              <div className="mt-6 flex justify-between space-x-4 no-print">
                <button
                  className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  disabled={!isSaveEnabled}
                  className={`w-full sm:w-auto px-4 py-2 ${
                    isSaveEnabled
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-white cursor-not-allowed"
                  } rounded-md transition duration-200`}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderModal;
