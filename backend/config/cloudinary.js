const cloudinary = require('cloudinary');

require('dotenv').config();

const connectCloud = ()=>{
    try 
    {
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.API_KEY,
            api_secret : process.env.CLOUD_SECRET
        })

        console.log("cloudinary connected successfully");
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports = connectCloud; 