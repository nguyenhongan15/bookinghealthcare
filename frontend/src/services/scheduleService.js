import api from "./http";

export const scheduleService = {
  getDaysByDoctor: (doctorId) => api.get(`/schedule/doctor/${doctorId}`),
  getSlotsByDay: (dayId) => api.get(`/schedule/day/${dayId}`),
  getAvailableDays(doctorId) {
    return api.get(`/schedule/doctor/${doctorId}`);
  },
  getAvailableSlots(dayId) {
    return api.get(`/schedule/day/${dayId}`);
  },

};
