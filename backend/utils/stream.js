const { StreamChat } = require('stream-chat');
const dotenv = require('dotenv');
dotenv.config();

const streamClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_SECRET_KEY);


const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        
        return streamClient.createToken(userIdStr);
    }
    catch (error) {
        console.log("Error occured at getnerateStreamToken function",error,message);
    }
}

module.exports = { generateStreamToken };