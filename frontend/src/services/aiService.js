import api from "./http";

export const aiService = {
  suggest: (symptom) =>
    api.post("/ai/suggest", {
      symptom,
    }),
};
