import api from "./http";

export const clinicService = {
  getAllClinics: () => api.get("/clinics")
};
