import axios from "axios";

export const registerUser = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/register`, data);
      return {
        status: res.status,
        message: res.data.message
      };
    } catch (error) {
      if (error.response) {
        console.log("Error Response:", error.response.data);
      }
      return {
        status: error.status,
        message: error.response.data.message
      };
    }
  };

  export const loginUser = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/login`, data);
      return {
        status: res?.status,
        data: res?.data
      };
    } catch (error) {
      if (error.response) {
        console.log("Error Response:", error.response.data);
      }
      return {
        status: error.status,
        message: error.response.data.message
      };
    }
  };
  