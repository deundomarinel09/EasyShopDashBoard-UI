// api/orderApi.js
import axios from "axios";

const testUrl = "https://localhost:7066";
const baseUrl = "https://mobileeasyshop.onrender.com"



const itemsEndPoint = "/api/Dash/Items";
const updateOrderStatusEndpoint = "/api/Dash/UpdateOrder";
const deleteProductEndpoint = "/api/Product/DeleteProduct";



const listProductEndpoint = "/api/Dash/GetAllProduct";
const listCategories = "/api/Dash/GetAllCategories";
const productById = "/api/Dash/GetProductById";
const updateProduct = "/api/Dash/UpdateProduct";
const addProduct = "/api/Dash/AddProduct";
const updateCategory = "/api/Dash/UpdateCategory";
const addCategory = "/api/Dash/AddCategory";

export const fetchDeleteProductData = (productId: number) => {
  return axios.post(`${baseUrl}${deleteProductEndpoint}`, { id: productId }); // Send id in the body
};



export const fetchListProductData = () => {
return axios.post(`${baseUrl}${listProductEndpoint}`)
};

export const fetchCategoriesData = () => {
    return axios.post(`${baseUrl}${listCategories}`);
};

export const fetchAddCategoryData = (category: { id: number; name: string }) => {
    return axios.post(`${baseUrl}${addCategory}`, category, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchUpdateCategoryData = (category: { id: number; name: string }) => {
    return axios.post(`${baseUrl}${updateCategory}`, category, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const fetchListProductByIdData = (id:number) => {
  return axios.post(`${baseUrl}${productById}/${id}`);
}

export const fetchItemData = () => {
  return axios.post(`${baseUrl}${itemsEndPoint}`);
};

export const fetchUpdateProductData = (formData: FormData) => {
  return axios.put(`${baseUrl}${updateProduct}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchAddProductData = (formData: FormData) => {
  return axios.put(`${baseUrl}${addProduct}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
