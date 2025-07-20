const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDb = ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("Database connected successfully");
    })
    .catch((error)=>{
        console.log("Error in connecting to database",error.message);
    })
}

module.exports = connectDb;