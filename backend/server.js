const express = require('express');

const connectDb = require('./config/database');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const chatRouter = require('./routes/chat.route');
const connectCloud = require('./config/cloudinary');
const { connectMail } = require('./config/nodemailer');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({
    origin : ['http://localhost:5173'],
    credentials : true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload(
    {
        useTempFiles : true,
        tempFileDir : '/tmp/'
    }
));  


connectDb();
connectMail();
connectCloud();

const PORT = process.env.PORT;

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/chat",chatRouter);

app.get("/",(req,res)=>{
    res.send("Hello,World!");
})

app.listen(PORT,()=>{
    console.log("Server started successfully");
})
