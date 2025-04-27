// api/orderApi.js
import axios from "axios";

const testUrl = "https://localhost:7066";
const baseUrl = "https://mobileeasyshop.onrender.com"
const orderEndPoint = "/api/Dash/Order";
const itemsEndPoint = "/api/Dash/Items";
const productEndPoint = "/api/Dash/GetAllProduct"
const updateOrderStatusEndpoint = "/api/Dash/UpdateOrder"



export const fetchProductData = () => {
return axios.post(`${baseUrl}${productEndPoint}`)
};

export const fetchOrderData = async () => {
  try {
    const response = await axios.post(`${baseUrl}${orderEndPoint}`);
    return response;
  } catch (error) {
    alert(`Error in fetchOrderData: ${error}`);
    throw error;
  }
};


export const fetchItemData = () => {
  return axios.post(`${baseUrl}${itemsEndPoint}`);
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`${baseUrl}${updateOrderStatusEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderRef: orderId, status: newStatus }),
    });

    if (!response.ok) throw new Error("Failed to update order status.");
    return await response.json();
  } catch (error) {
    alert(error);
    throw error;
  }
};
