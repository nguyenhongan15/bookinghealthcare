import api from "./http";

export const scheduleService = {

  // Lấy danh sách ngày khám theo bác sĩ
  getDaysByDoctor: (doctorId) => api.get(`/schedule/doctor/${doctorId}`),

  // Lấy danh sách slot theo ngày
  getSlotsByDay: (dayId) => api.get(`/schedule/day/${dayId}`),

  // Tạo ngày khám mới
  createDay: (data) => api.post("/schedule/day", data),

  // Tạo slot mới
  createSlot: (data) => api.post("/schedule/slot", data),

  // Xoá ngày khám
  deleteDay: (id) => api.delete(`/schedule/day/${id}`),

  // Xoá slot khám
  deleteSlot: (id) => api.delete(`/schedule/slot/${id}`),
};
