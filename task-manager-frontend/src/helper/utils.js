import {decodeToken} from 'react-jwt'

export function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

export const tokenAvailable = () => {
    const token = localStorage.getItem('token')
    return token ? true : false
}

export const addTokenToHeader = ({headers}) => {
    const token = localStorage.getItem('token')
    if(token) {
        headers.Authorization = `${token}`
    }
    return headers
}

export const getIdFromToken = () => {
    const token = localStorage.getItem('token')
    const decoded = decodeToken(token)
    if(decoded?.id) {
        return decoded.id
    } else {
        return false
    }
}

export const logOutUser = () => {
    localStorage.removeItem('token')
}