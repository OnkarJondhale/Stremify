import axios from 'axios';
import { toast } from 'react-hot-toast';

import { setUserData } from "../redux/slices/user.slice"
import { clearUserData } from '../redux/slices/user.slice';

const authApi = import.meta.env.VITE_AUTH_API;
const userApi = import.meta.env.VITE_USER_API;
const chatApi = import.meta.env.VITE_CHAT_API;

export const signup = async ({ email, password, fullName, otp }, navigate, dispatch) => {
    const toastId = toast.loading('Creating your account...');
    try {
        const response = await axios.post(`${authApi}/signup`, {
            email,
            password,
            fullName,
            otp,
        }, { withCredentials: true });

        toast.success('Signup successful!');
        dispatch(setUserData(response.data.data));
        localStorage.setItem("user", JSON.stringify(response.data.data));
        navigate("/onboarding");
    } catch (error) {
        console.error('Error at signup function:', error);
        toast.error(
            error.response?.data?.message || 'Something went wrong during signup.'
        );
    } finally {
        toast.dismiss(toastId);
    }
};


export const isAuthenticated = async () => {
    try {
        const res = await axios.get(`${authApi}/me`, { withCredentials: true });
        sessionStorage.setItem("friend-request-count", res.data.data.friendRequestCount);
        return { success: true, user: res.data.data, isValid: true, networkError: false };
    } catch (err) {
        if (
            err.response &&
            [400, 401, 404].includes(err.response.status)
        ) {
            return { success: false, isValid: false, networkError: false };
        }
        return { success: false, isValid: null, networkError: true };
    }
};

export const sendOtp = async (email, navigate) => {
    const toastId = toast.loading("Sending the otp")
    try {
        const response = await axios.post(`${authApi}/sendotp`, {
            email
        });

        toast.success("Otp sent successfully");
        navigate('/verifyotp');
    }
    catch (error) {
        console.error('Error at sendOtp function:', error);
        toast.error(
            error.response?.data?.message || 'Something went wrong during sending otp.'
        );
    }
    finally {
        toast.dismiss(toastId);
    }
}

export const login = async (email, password, navigate, dispatch) => {
    const toastId = toast.loading("Setting things up for you");
    try {
        const response = await axios.post(`${authApi}/login`, {
            email,
            password
        }, { withCredentials: true });

        toast.success("Login Successful");
        dispatch(setUserData(response.data.data));
        localStorage.setItem("user", JSON.stringify(response.data.data));
        navigate("/");
    }
    catch (error) {
        console.log('Error at login function', error);
        toast.error(
            error.response?.data?.message || 'Something went wrong during login.'
        )
    }
    finally {
        toast.dismiss(toastId);
    }
}

export const onboarding = async (data,navigate,dispatch) => {
    const toastId = toast.loading("Hang on,getting you onboarded!");
    const formData = new FormData();

    formData.append('file', data.file || null);
    formData.append('username', data.username || '');
    formData.append('dob', data.dob || '');
    formData.append('phone', data.phone || '');
    formData.append('address', data.address || '');
    formData.append('country', data.country || '');
    formData.append('bio', data.bio || '');
    formData.append('nativeLanguage', data.nativeLanguage || '');

    formData.append('proficientLanguages', JSON.stringify(data.proficientLanguages || []));
    formData.append('interests', JSON.stringify(data.interests || []));

    try {
        const response = await axios.patch(`${authApi}/onboarding`,formData,{withCredentials : true});

        dispatch(setUserData(response.data.data));
        localStorage.setItem("user", JSON.stringify(response.data.data));
        toast.success("Onboarding completed");
        navigate("/");
    }
    catch (error) {
        console.log('Error at onboarding function', error);
        toast.error(
            error.response?.data?.message || 'Something went wrong during onboarding.'
        )
    }
    finally {
        toast.dismiss(toastId);
    }
}

export const logout = async (dispatch,navigate) => {
    const toastId = toast.loading('See you soon...');
    try
    {
        await axios.post(`${authApi}/logout`, {}, { withCredentials: true });

        localStorage.removeItem("user");
        dispatch(clearUserData());
        navigate("/login");
        toast.success("logout successful");
    }
    catch(error)
    {
        console.error('Error at logout function:', error);
        toast.error(
            'Something went wrong during logout.'
        );
    }
    finally 
    {
        toast.dismiss(toastId);
    }
}