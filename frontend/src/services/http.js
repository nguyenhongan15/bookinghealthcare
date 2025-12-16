import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: [
    function (data, headers) {
      headers['Content-Type'] = 'application/json';
      return JSON.stringify(data);   // CHUYỂN OBJECT → JSON CHUẨN
    }
  ]
});

export default api;
