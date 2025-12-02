import api from "./http";

export const doctorService = {

  getAllDoctors: () => api.get("/doctors"),

  getDoctorById: (id) => api.get(`/doctors/${id}`),


  searchDoctors: (keyword) =>
    api.get("/doctors/filter", { params: { q: keyword } }),

  // 🟢 LẤY BÁC SĨ THEO CHUYÊN KHOA
  getDoctorsByClinic: (clinicId) =>
    api.get(`/doctors/clinic/${clinicId}`),

  getDoctorsBySpeciality: (specialityId) =>
    api.get(`/doctors/speciality/${specialityId}`),
};
