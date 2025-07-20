const express = require('express');
const userRouter = express.Router();

const { getRecommendedFriends, getMyFriends,sendFriendRequest,acceptFriendRequest, getFriends, getFriendRequest,outgoingFriendRequest,rejectFriendRequest,searchFriend } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth');

userRouter.use(auth);

userRouter.get('/getrecommendedfriends', getRecommendedFriends);
userRouter.get('/getmyfriends', getMyFriends);
userRouter.post('/send/friendrequest/:id',sendFriendRequest);
userRouter.put('/accept/friendrequest/:id',acceptFriendRequest);
userRouter.delete('/reject/friendrequest/:id',rejectFriendRequest);
userRouter.get('/getfriends',getFriends)
userRouter.get('/getfriendsrequest',getFriendRequest);
userRouter.get("/getoutgoingfriendrequest",outgoingFriendRequest);
userRouter.get("/searchfriend/:key",searchFriend)

module.exports = userRouter;
