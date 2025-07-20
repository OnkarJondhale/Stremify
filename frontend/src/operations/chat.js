import axios from "axios";
import {toast} from 'react-hot-toast'

const authApi = import.meta.env.VITE_AUTH_API;
const userApi = import.meta.env.VITE_USER_API;
const chatApi = import.meta.env.VITE_CHAT_API;

export const getStreamToken = async () => {
    try 
    {
        const response = await axios.get(`${chatApi}/streamtoken`,{withCredentials : true})

        return response.data.data;
    }
    catch(error)
    {
        console.log("Error occured at getting stream token",error.message);
        toast.error("Chat service is not available now ")
        return null;
    }
}