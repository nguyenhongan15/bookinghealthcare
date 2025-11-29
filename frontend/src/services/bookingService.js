import api from "./http";

export const bookingService = {

  // Tạo booking
  createBooking: (data) => api.post("/bookings", data),

  // Lấy tất cả booking
  getAll: () => api.get("/bookings"),

  // Lấy booking theo ID
  getById: (id) => api.get(`/bookings/${id}`),

  // Lịch sử đặt lịch theo sđt
  getByPatientPhone: (phone) => 
    api.get(`/bookings/patient`, { params: { phone } }),

  // Booking theo bác sĩ
  getByDoctor: (doctorId) => api.get(`/bookings/doctor/${doctorId}`),

  // Đổi trạng thái booking
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),

  // Xoá booking
  delete: (id) => api.delete(`/bookings/${id}`),
};
