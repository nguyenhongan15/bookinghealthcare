import api from "./http";

export const scheduleService = {
  getDaysByDoctor: (doctorId) => api.get(`/schedule/doctor/${doctorId}`),
  getSlotsByDay: (dayId) => api.get(`/schedule/day/${dayId}`),

  // NẾU LỖI THÌ XOÁ CÁC DÒNG DƯỚI ĐÂY
  getAvailableDays(doctorId) {
    return api.get(`/schedule/doctor/${doctorId}`);
  },
  getAvailableSlots(dayId) {
    return api.get(`/schedule/day/${dayId}/slots`);
  },

};
