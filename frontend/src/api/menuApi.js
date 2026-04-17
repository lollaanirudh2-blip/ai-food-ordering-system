import API from "./authApi";

export const getMenuByRestaurantId = (restaurantId) =>
  API.get(`/restaurants/${restaurantId}/menu`);