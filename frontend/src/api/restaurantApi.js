import API from "./authApi";

export const getRestaurants = () => API.get("/restaurants");
export const getRestaurantById = (id) => API.get(`/restaurants/${id}`);
export const searchRestaurants = (query) =>
  API.get(`/restaurants/search?q=${encodeURIComponent(query)}`);