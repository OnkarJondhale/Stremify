import axios from "axios";
import { toast } from "react-hot-toast";

const userApi = import.meta.env.VITE_USER_API;

export const getRecommendedFriends = async () => {
    try {
        const response = await axios.get(`${userApi}/getrecommendedfriends`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        console.log("Error occured at getrecommended friends",error.message)
        return [];
    }
};

export const getoutgoingfriendrequest = async () => {
    try {
        const response = await axios.get(`${userApi}/getoutgoingfriendrequest`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        console.log(error.message)
        return [];
    }
};

export const getFriendRequests = async () => {
    try {
        const response = await axios.get(`${userApi}/getfriendsrequest`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch friend requests");
        return [];
    }
};

export const rejectFriendRequest = async (senderId) => {
    try {
        const response = await axios.delete(`${userApi}/reject/friendrequest/${senderId}`, { withCredentials: true });
        toast.success("Friend request rejected");
        return response.data;
    } catch (error) {
        toast.error("Failed to reject friend request");
        return null;
    }
};

export const getMyFriends = async () => {
    try {
        const response = await axios.get(`${userApi}/getfriends`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        toast.error("Failed to fetch friends");
        return [];
    }
};

export const sendFriendRequest = async (receiverId) => {
    try {
        const response = await axios.post(`${userApi}/send/friendrequest/${receiverId}`,{},{ withCredentials: true });
        toast.success("Hey, you've just opened the door to a new friendship")
        return response.data.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
        return null;
    }
};

export const acceptFriendRequest = async (senderId) => {
    try {
        const response = await axios.put(`${userApi}/accept/friendrequest/${senderId}`,{}, { withCredentials: true });
        toast.success("Hey, You got a new friend")
        return response.data.data;
    } catch (error) {
        toast.error("Failed to accept friend request");
        return null;
    }
};

export const searchFriend = async (key) => {
    try 
    {
        const response = await axios.get(`${userApi}/searchfriend/${key}`,{withCredentials : true});

        return response.data.data;
    }
    catch(error) {
        console.log("Error occured in searching friend");
        return [];
    }
}


export const getAllFriends = async () => {
    try 
    {
        const response = await axios.get(`${userApi}/getmyfriends`,{withCredentials : true});

        return response.data.data[0].friends;
    }
    catch(error)
    {
        console.log("Error occured in getting all friends");
        return [];
    }
}