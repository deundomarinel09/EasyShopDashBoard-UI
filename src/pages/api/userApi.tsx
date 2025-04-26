import axios from 'axios';

// BASE URLs
const BASE = 'https://mobileeasyshop.onrender.com/api';
const TESTBASE = 'https://localhost:7066/api'; // Keep for local testing

// Endpoints
const signUpEndPoint = '/User/SignUpDash';
const loginEndPoint = '/user/loginDash';
const verifyOtpEndPoint = '/user/verify-otpDash';
const resendOtpEndPoint = '/user/resend-otpDash';

// Full URLs
const signUpUrl = `${TESTBASE}${signUpEndPoint}`;
const loginUrl = `${TESTBASE}${loginEndPoint}`;
const verifyOtpUrl = `${TESTBASE}${verifyOtpEndPoint}`;
const resendOtpUrl = `${TESTBASE}${resendOtpEndPoint}`;

// Types
interface ApiResponse<T = any> {
  success?: boolean;
  message: string;
  data?: T;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface ResendOtpPayload {
  email: string;
}

interface LoginPayload {
  email: string;
  passWord: string;
}

export interface SignUpPayload {
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    passwordhash: string; 
  }
  

// Verify OTP
export const verifyOtp = async (email: string, otp: string): Promise<ApiResponse> => {
  try {
    const res = await axios.post<ApiResponse>(verifyOtpUrl, { email, otp });
    return res.data;
  } catch (err: any) {
    console.error("[verifyOtp] error:", err.response?.data || err.message);
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, message: "Something went wrong" };
  }
};

// Resend OTP
export const resendOtp = async (email: string): Promise<ApiResponse> => {
  try {
    const res = await axios.post<ApiResponse>(
      resendOtpUrl,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("[resendOtp] error:", err.response?.data || err.message);
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { success: false, message: "Something went wrong" };
  }
};

// Login
export const fetchLogin = async (values: LoginPayload): Promise<ApiResponse> => {
  try {
    const res = await axios.post<ApiResponse>(loginUrl, values);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

// Sign Up
export const fetchCreateAccount = async (values: SignUpPayload): Promise<ApiResponse> => {
    console.log("values",values);
  const res = await axios.post<ApiResponse>(signUpUrl, values);
  return res.data;
};

// Fetch All Users
export const fetchUsers = async (): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(`${BASE}/user/user`);
  return res.data;
};

// Fetch All Products
export const fetchProducts = async (): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(`${BASE}/product`);
  return res.data;
};
