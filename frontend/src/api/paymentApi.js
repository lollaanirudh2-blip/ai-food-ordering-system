import API from "./authApi";

export const mockPay = (data) => API.post("/payments/mock-pay", data);