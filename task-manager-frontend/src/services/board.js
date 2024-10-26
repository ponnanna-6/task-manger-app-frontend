import {addTokenToHeader} from "../helper/utils";
import axios from "axios";

export const getBoardData = async () => {
    try {
        const headers = addTokenToHeader({ headers: {} });
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/board`,
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