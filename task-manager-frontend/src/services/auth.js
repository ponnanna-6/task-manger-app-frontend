import axios from "axios";
import { addTokenToHeader, getIdFromToken } from "../helper/utils";

export const registerUser = async (data) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/user/register`, data);
    console.log(res)
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

export const getUserInfo = async () => {
  try {
    const id = getIdFromToken()
    const headers = addTokenToHeader({headers:{}})
    if(headers) {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/id/${id}`, 
        {headers}
      );
      return {
        status: res?.status,
        data: res?.data[0]
      };
    }
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

export const updateUserInfo = async (data) => {
  try {
    const id = getIdFromToken()
    const headers = addTokenToHeader({headers:{}})
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/user/update/${id}`, data, {headers});
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

}
