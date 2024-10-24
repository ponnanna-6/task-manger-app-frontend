import { decodeToken } from 'react-jwt'

export function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

export const tokenAvailable = () => {
    const token = localStorage.getItem('token')
    return token ? true : false
}

export const addTokenToHeader = ({ headers }) => {
    const token = localStorage.getItem('token')
    if (token) {
        headers.Authorization = `${token}`
    }
    return headers
}

export const getIdFromToken = () => {
    const token = localStorage.getItem('token')
    const decoded = decodeToken(token)
    if (decoded?.id) {
        return decoded.id
    } else {
        return false
    }
}

export const logOutUser = () => {
    localStorage.removeItem('token')
}

export const getTodaysDate = () => {
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    return formattedDate
}

export const getDueData = (dateStr) => {
    const dateObj = new Date(dateStr);
    const options = { month: 'long' };
    const month = dateObj.toLocaleString('en-US', options);

    // Get day of the month
    const day = dateObj.getUTCDate();

    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    const formattedDate = `${month} ${day}${getOrdinalSuffix(day)}`;

    return formattedDate
}

export function isBeforeDueDate(dueDate) {
    const todayDate = new Date();
    const dueDateObj = new Date(dueDate);

    if (todayDate > dueDateObj) {
        return true;
    } else {
        return false;
    }
}

export const writeShareLinkToClipboard = (id) => {
    try {
        const domain = window.location.host;
        navigator.clipboard.writeText(`${domain}/public/task/${id}`)
        return true
    } catch (error) {
        return false
    }
}