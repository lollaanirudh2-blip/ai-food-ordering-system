import API from "./authApi";

export const verifyOtp = (data) => API.post("/auth/verify-otp", data);