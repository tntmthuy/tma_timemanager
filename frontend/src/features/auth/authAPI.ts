import axios from "axios";

export const loginAPI = (data: { email: string; password: string }) => {
  return axios.post("http://localhost:8081/api/auth/authenticate", data);
};

