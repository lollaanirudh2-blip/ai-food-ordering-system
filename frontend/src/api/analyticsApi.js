import API from "./authApi";

export const getAnalyticsDashboard = () => API.get("/analytics/dashboard");