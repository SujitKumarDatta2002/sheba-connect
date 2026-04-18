import API from "../config/api";
import axios from "axios";

export const getComplaints = () => {
  return axios.get(`${API}/api/complaints`);
};

