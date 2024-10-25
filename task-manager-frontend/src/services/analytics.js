import { addTokenToHeader, getIdFromToken } from "../helper/utils";
import axios from "axios";

export const getUserAnalytics = async () => {
    try {
        const headers = addTokenToHeader({ headers: {} })
        if (headers) {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/analytics/`,
                {headers}
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