const express = require('express');
const chatRouter = express.Router();

const {getChatToken} = require('../controllers/chat.controller');

const {auth} = require('../middlewares/auth');

chatRouter.use(auth);

chatRouter.get("/streamtoken",getChatToken);


module.exports = chatRouter;