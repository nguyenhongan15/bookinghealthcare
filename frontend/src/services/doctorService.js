import api from "./http";

export const doctorService = {

  getAllDoctors: () => api.get("/doctors"),

  getDoctorById: (id) => api.get(`/doctors/${id}`),

  searchDoctors: (keyword) =>
    api.get("/doctors/filter", { params: { q: keyword } }),

  // 🟢 LẤY BÁC SĨ THEO CHUYÊN KHOA
  getDoctorsBySpeciality: (specialityId) =>
    api.get("/doctors/filter", {
      params: { specialityId }
    }),
};
