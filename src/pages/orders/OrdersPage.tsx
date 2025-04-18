import { useState, useEffect, useRef } from "react";
import { Search, Filter, Download } from "lucide-react";

import { fetchOrderData, updateOrderStatus, fetchItemData, fetchProductData } from "../api/orderApi";
import OrderModal from "./components/OrderModal";
import SummaryCards from "./components/SummaryCards";
import OrdersTable from "./components/OrdersTable";


type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: string;
  items: number;
  payment: string;
};

const OrdersPage = () => {


  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateRange, setDateRange] = useState("All");
  const ordersRef = useRef<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const fetchAndUpdateProducts = async () => {
    try {
      const response = await fetchProductData();
      const productArray = response.data?.$values || response.data;
      setProducts(productArray);
    } catch (error: any) {
      alert(`Error fetching products: ${error}`);

    }
  };

  const fetchAndUpdateItems = async () => {
    try {
      const response = await fetchItemData();
      const itemArray = response.data?.$values || response.data;
      setItems(itemArray);
    } catch (error: any) {
      alert(`Error fetching items: ${error}`);
    }
  };


  const fetchAndUpdateOrders = async () => {
    try {
      const response = await fetchOrderData();
      const orderArray = response.data.$values;

      const newData = JSON.stringify(orderArray);
      const currentData = JSON.stringify(ordersRef.current);

      if (newData !== currentData) {
        setOrders(orderArray);
        ordersRef.current = orderArray;
      }
    } catch (error: any) {
      alert(`Error fetching orders: ${error}`);
    }
  };

  useEffect(() => {
    fetchAndUpdateOrders();
    fetchAndUpdateItems();
    fetchAndUpdateProducts();


    const interval = setInterval(fetchAndUpdateOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = orders.reduce(
    (sum, order) => (order.status === "Completed" ? sum + order.amount : sum),
    0,
  );
  const pendingAmount = orders.reduce(
    (sum, order) => (order.status === "Pending" ? sum + order.amount : sum),
    0,
  );
  const refundedAmount = orders.reduce(
    (sum, order) => (order.status === "Cancelled" ? sum + order.amount : sum),
    0,
  );

  //for MODAL FUNCTIONALITY
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState("");

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  // Sample status options for the dropdown
  const statusOptions = [
    "Pending",
    "Processing",
    "Shipped",
    "Completed",
    "Cancelled",
  ];

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setUpdatedStatus("");
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatedStatus(e.target.value);
  };

  const handleSave = async () => {
    if (selectedOrder) {
      try {
        // Call your updateOrderStatus function here
        await updateOrderStatus(selectedOrder.id, updatedStatus);

        // After successfully updating the status, you can close the modal and reset states
        alert("Order status updated successfully!");
        closeModal();
      } catch (error) {
        alert(`Failed to update order status: ${error}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">Manage and process customer orders</p>
      </div>

      {/* Summary Cards Component */}
      <SummaryCards
        totalAmount={totalAmount}
        pendingAmount={pendingAmount}
        refundedAmount={refundedAmount}
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search orders by ID, customer, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <select
              className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="ThisWeek">This Week</option>
              <option value="ThisMonth">This Month</option>
              <option value="Last30Days">Last 30 Days</option>
            </select>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        filteredOrders={filteredOrders}
        onViewClick={handleViewClick}
      />

      {/* Optional Modal for Viewing and Updating Order Status */}
      <OrderModal
        isModalOpen={isModalOpen}
        selectedOrder={selectedOrder}
        updatedStatus={updatedStatus}
        statusOptions={statusOptions}
        handleStatusChange={handleStatusChange}
        handleSave={handleSave}
        closeModal={closeModal}
        items={items}
        products={products}
      />


    </div>
  );
};

export default OrdersPage;
