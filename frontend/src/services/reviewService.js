import api from "./http";

export const reviewService = {
  create: (data) => api.post("/reviews", data),
  getByDoctor: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
};
