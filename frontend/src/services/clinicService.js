import api from "./http";
import axios from "axios";

export const clinicService = {
  // getAllClinics: () => api.get("/clinics"),

  getClinicById: (id) => api.get(`/clinics/${id}`),
  getAllClinics: () => axios.get("http://localhost:8080/api/clinics"),
};
