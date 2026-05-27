import axios from "axios";
import Api from './axiosConfig.js';

const API_URL = "https://doroob.runasp.net/api/v1/auth";

// ===================== تسجيل الدخول =====================
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);

       if (response.data && response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('refresh', response.data.refreshToken);
        }
         
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Login failed");
    }
};

// ===================== إنشاء حساب =====================
export const Register = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/Regester`, credentials);
        console.log(response.data);
        return response;
    } catch (error) {
        throw error 
    }
};

// ===================== تأكيد الإيميل =====================
export const VerifyEmail = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/verify-email`, credentials);
        console.log(response.data);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Email verification failed");
    }
};

// ===================== نسيت كلمة السر =====================
export const ForgotPassword = async (credentials) => {
    try {
        const response = await Api.post('Auth/forgot-password', credentials);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Forgot password failed");
    }
};

// ===================== التحقق من كود إعادة التعيين =====================
export const VerifyResetCode = async (credentials) => {
    try {
        const response = await Api.post('Auth/verify-reset-code', credentials);
        console.log(response.data);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Code verification failed");
    }
};

// ===================== إعادة تعيين كلمة السر (بالكود) =====================
export const ResetPasswordFinal = async (credentials) => {
    try {
        const response = await Api.post('Auth/reset-password-final', credentials);
        console.log(response.data);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Password reset failed");
    }
};

// ===================== تحديث كلمة السر (من البروفايل) =====================
export const UpdatePassword = async (credentials) => {
    try {
        const response = await Api.post('Auth/update-password', credentials);
        console.log(response.data);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Password update failed");
    }
};