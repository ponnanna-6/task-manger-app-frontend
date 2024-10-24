import axios from "axios";
import { addTokenToHeader, getIdFromToken } from "../helper/utils";
export const getUserTasks = async (filter) => {
    try {
        const headers = addTokenToHeader({ headers: {} })
        if (headers) {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/task/user`,
                { headers, params: { filter } }
            );
            return {
                status: res?.status,
                data: res?.data
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

export const addTaskToDb = async (data) => {
    try {
        const id = getIdFromToken()
        const headers = addTokenToHeader({ headers: {} })
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/task/add`, data, { headers });
        return {
            status: res?.status,
            data: res?.data
        };
    } catch (error) {
        console.log(error)
        return {
            status: error?.status ? error.status : 500,
            message: error?.response?.data?.message ? error.response.data.message : "Something went wrong"
        };
    }
};

export const getTaskById = async (id) => {
    try {
        const headers = addTokenToHeader({ headers: {} })
        if (headers) {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/task/id/${id}`,
                { headers }
            );
            return {
                status: res?.status,
                data: res?.data
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

export const editTaskInDb = async (id, data) => {
    try {
        const headers = addTokenToHeader({ headers: {} })
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/task/edit/${id}`, data, { headers });
        return {
            status: res?.status,
            data: res?.data
        };
    } catch (error) {
        console.log(error)
        return {
            status: error?.status ? error.status : 500,
            message: error?.response?.data?.message ? error.response.data.message : "Something went wrong"
        };
    }
};

//update task state
export const updateTaskState = async (id, state) => {
    try {
        const headers = addTokenToHeader({ headers: {} })
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/v1/task/status/${id}`, { taskStatus: state }, { headers });
        return {
            status: res?.status,
            data: res?.data || {}
        };
    } catch (error) {
        console.log(error)
        return {
            status: error?.status ? error.status : 500,
            message: error?.response?.data?.message ? error.response.data.message : "Something went wrong"
        };
    }
}

export const getPublicTask = async (id) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v2/public/task/${id}`);
        console.log(res.data)
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