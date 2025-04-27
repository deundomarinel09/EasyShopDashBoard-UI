import axios from 'axios';

// BASE URLs
const BASE = 'https://mobileeasyshop.onrender.com/api';
const TESTBASE = 'https://localhost:7066/api'; // Keep for local testing

// Endpoints
const signUpEndPoint = '/User/SignUpDash';
const loginEndPoint = '/user/loginDash';
const verifyOtpEndPoint = '/user/verify-otpDash';
const resendOtpEndPoint = '/user/resend-otpDash';
const GetAllUserCustomerEndPoint = '/user/GetAllUserCustomer';
const GetAllUserDashEndPoint = '/user/GetAllUserDash';
const DeleteUserDashEndPoint = '/user/DeleteUserDash';


// Full URLs
const signUpUrl = `${TESTBASE}${signUpEndPoint}`;
const loginUrl = `${TESTBASE}${loginEndPoint}`;
const verifyOtpUrl = `${TESTBASE}${verifyOtpEndPoint}`;
const resendOtpUrl = `${TESTBASE}${resendOtpEndPoint}`;
const getAllUserUrl = `${TESTBASE}${GetAllUserCustomerEndPoint}`;
const getAllUserDash = `${TESTBASE}${GetAllUserDashEndPoint}`;
const DeleteUserDash = `${TESTBASE}${DeleteUserDashEndPoint}`;


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
    role: string;
    phonenumber: string;
    passwordhash: string; 
  }
  

  export const fetchAllUsers = async (): Promise<any> => {
    const res = await axios.post(getAllUserUrl);
    return res.data;
  };

  
// Verify OTP
export const verifyOtp = async (email: string, otp: string): Promise<ApiResponse> => {
  try {
    const res = await axios.post<ApiResponse>(verifyOtpUrl, { email, otp });
    return res.data;
  } catch (err: any) {
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
  const res = await axios.post<ApiResponse>(signUpUrl, values);
  return res.data;
};

// Fetch All Users
export const fetchUsers = async (): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(`${BASE}/user/user`);
  return res.data;
};

export const fetchUsersDash = async (): Promise<ApiResponse> => {
  const res = await axios.post<ApiResponse>(`${getAllUserDash}`);
  return res.data;
};

// Fetch All Products
export const fetchProducts = async (): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(`${BASE}/product`);
  return res.data;
};

export const deleteUserDash = async (userId: number) => {
  return await axios.delete(`${DeleteUserDash}/${userId}`);
};