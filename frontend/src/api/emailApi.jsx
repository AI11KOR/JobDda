import API from './axiosApi';

export const sendEmailCodeBtn = async (email) => {
    const response = await API.post('/api/send-email', {email});
    return response.data;
}

export const verifyEmailCodeBtn = async (email, code) => {
    const response = await API.post('/api/verify-email', {email, code});
    return response.data;
}

export const sendEmailResetCodeBtn = async (email) => {
    const response = await API.post('/api/reset/send-email', {email})
    return response.data;
}

export const verifyEmailResetCodeBtn = async (email, code) => {
    const response = await API.post('/api/reset/verify-email', {email, code});
    return response.data;
}