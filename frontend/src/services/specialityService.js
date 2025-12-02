import api from "./http";

export const specialityService = {
  getAllSpecialities: () => api.get("/specialities"),
  getSpecialityById: (id) => api.get(`/specialities/${id}`),

};
