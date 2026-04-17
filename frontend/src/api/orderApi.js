import API from "./authApi";

export const createOrder = () => API.post("/orders/create");
export const getOrders = () => API.get("/orders");
export const getOrderById = (orderId) => API.get(`/orders/${orderId}`);
export const reorderOrder = (orderId) => API.post(`/orders/${orderId}/reorder`);