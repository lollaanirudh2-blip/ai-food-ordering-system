import API from "./authApi";

export const addToCart = (data) => API.post("/cart/add", data);
export const getCart = () => API.get("/cart");
export const removeCartItem = (id) => API.delete(`/cart/${id}`);
export const increaseCartItem = (id) => API.patch(`/cart/${id}/increase`);
export const decreaseCartItem = (id) => API.patch(`/cart/${id}/decrease`);