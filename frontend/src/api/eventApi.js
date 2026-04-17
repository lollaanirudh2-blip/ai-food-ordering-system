import API from "./authApi";

export const trackEvent = (data) => API.post("/events/track", data);