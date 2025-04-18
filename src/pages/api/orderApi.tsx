// api/orderApi.js
import axios from "axios";

//const baseUrl = "https://localhost:7066";
const baseUrl = "https://mobileeasyshop.onrender.com"
const orderEndPoint = "/api/Dash/Order";
const itemsEndPoint = "/api/Dash/Items";
const productEndPoint = "/api/Dash/GetAllProduct"

export const fetchProductData = () => {
return axios.post(`${baseUrl}${productEndPoint}`)
};

export const fetchOrderData = () => {
  return axios.post(`${baseUrl}${orderEndPoint}`);
};

export const fetchItemData = () => {
  return axios.post(`${baseUrl}${itemsEndPoint}`);
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error("Failed to update order status.");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
