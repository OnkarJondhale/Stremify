const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const connectDb = require('./config/database');
const connectCloud = require('./config/cloudinary');
const { connectMail } = require('./config/nodemailer');

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const chatRouter = require('./routes/chat.route');

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://stremify-silk.vercel.app'],
  credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

connectDb();
connectMail();
connectCloud();

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('Hello, World! → Fix cookies');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});
