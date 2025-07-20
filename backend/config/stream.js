const { StreamChat } = require('stream-chat');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

module.exports = serverClient;