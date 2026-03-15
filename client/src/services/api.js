import axios from "axios";

export const getComplaints = () => {
  return axios.get("http://localhost:5000/api/complaints");
};

