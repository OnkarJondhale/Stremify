const User = require('../models/user.models');
const FriendRequest = require("../models/friendrequest.models")
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = async (req,res,next) => {
    try 
    {
        const token = req.cookies.token;

        console.log("Token is ",token);
        if(!token) {
            return res.status(401).json({
                success : false,
                message : "Token is required"
            })
        }

        const payload = await jsonwebtoken.verify(token,process.env.JWT_SECRET_KEY);

        if(!payload) {
            return res.status(401).json({
                success : false,
                message : "Token is invalid"
            })
        }

        const user = await User.findOne({_id : payload.userId}).select('-password');

        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User does not exists"
            })
        }

        const friendRequestCount = await FriendRequest.find({receiver : user._id,status : "pending"});
        
        req.user = user; 
        req.user.token = token;
        req.user.friendRequestCount = friendRequestCount.length;
        
        next();
    }
    catch(error)
    {
        console.log("Error occured in auth function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error : error.message
        })
    }
}

module.exports = {auth};