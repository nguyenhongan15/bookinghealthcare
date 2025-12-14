import api from "./http";

export const healthProfileService = {
  getMyProfile: (userId) =>
    api.get("/health-profile/me", { params: { userId } }),

  updateMyProfile: (userId, data) =>
    api.put("/health-profile/me", data, { params: { userId } }),

  doctorViewPatient: (userId, doctorId) =>
    api.get(`/health-profile/patient/${userId}`, {
      params: { doctorId }
    })
  
};
