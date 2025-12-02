import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
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
