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
  updateStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { status }),
  

  getByUserId: (userId) =>
    api.get(`/bookings/user/${userId}`),

  getUserSchedule: (userId) =>
    api.get("/bookings/user-schedule", {
      params: { userId },
    }),
  
  

  // Xoá booking
  delete: (id) => api.delete(`/bookings/${id}`),
};
