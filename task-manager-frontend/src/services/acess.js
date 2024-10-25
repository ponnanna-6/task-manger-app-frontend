import { addTokenToHeader, getIdFromToken } from "../helper/utils";
import axios from "axios";

export const shareBoard = async (email) => {
    try {
        const headers = addTokenToHeader({ headers: {} });
        const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/v1/access/boards/share`,
            {email},
            { headers }
        );
        return {
            status: res.status,
            data: res.data,
        };
    } catch (error) {
        return {
            status: error.status,
            message: error.response.data.message,
        };
    }
}