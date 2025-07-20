const mongoose = require('mongoose');
const { mailSender } = require('../utils/mail');

const schema = new mongoose.Schema({
    otp : Number,
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 5*60
    },
    email : String
},{timestamps : true})


schema.pre("save",async function(next){
    try 
    {
        const response = await mailSender("OTP for signing up on STREAMIFY",this.email,`<h1> Your OTP for registration is : ${this.otp} <br> Hurry up!, the OTP is valid for 5 minutes only </h1>`);
        next();
    }
    catch(error)
    {
        next(error);
    }
})


module.exports = mongoose.model("Otp",schema);