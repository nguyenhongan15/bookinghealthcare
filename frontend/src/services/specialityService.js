import api from "./http";

export const specialityService = {
  getAllSpecialities: () => api.get("/specialities"),
};
