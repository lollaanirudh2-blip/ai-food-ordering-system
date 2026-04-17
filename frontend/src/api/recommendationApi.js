import API from "./authApi";

export const getHomeRecommendations = () => API.get("/recommendations/home");
export const getInstantSuggestion = () => API.get("/recommendations/instant");
export const getTrendingRecommendations = () => API.get("/recommendations/trending");