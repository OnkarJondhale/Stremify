const User = require('../models/user.models');
const FriendRequest = require('../models/friendrequest.models')

const getRecommendedFriends = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = req.user;

        const recommendedFriends = await User.find({
            $and: [
                { _id: { $ne: userId } },
                { _id: { $nin: user.friends } },
                { isOnboarded: true }
            ],
            $or: [
                { interests: { $in: user.interests } },
                { nativeLanguage: user.nativeLanguage },
                { proficientLanguages: { $in: user.proficientLanguages } }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Recommended friends fetched successfully",
            data: recommendedFriends
        });
    }
    catch (error) {
        console.log("Error occured in getRecommendedFriends function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


const getMyFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friends = await User.find({ _id: userId }).select("friends").populate('friends').exec();

        return res.status(200).json({
            success: true,
            message: "My Friends fetched successfully",
            data: friends
        })
    }
    catch (error) {
        console.log("Error occured in getMyFriends function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const sender = req.user._id;
        const receiver = req.params.id;

        if (!sender || !receiver) {
            return res.status(400).json({
                success: false,
                message: "Sender or receiver is missing"
            });
        }

        if (sender == receiver) {
            return res.status(400).json({
                success: false,
                message: "You can't sent the friend request to yourself"
            })
        }

        const userExist = await User.findOne({ _id: receiver });

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "Receiver does not exist"
            })
        }

        if (req.user.friends.includes(receiver)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends"
            })
        }

        const friendRequestExist = await FriendRequest.findOne({
            $or: [
                { sender: sender, receiver: receiver },
                { sender: receiver, receiver: sender }
            ]
        }
        );

        if (friendRequestExist) {
            return res.status(400).json({
                success: false,
                message: "Friend Requets is already present"
            })
        }

        const response = await FriendRequest.create({ sender: sender, receiver: receiver })

        return res.status(201).json({
            success: true,
            message: "Friend request sent successfully",
            data: response
        })
    }
    catch (error) {
        console.log("Error occured in send friendRequest function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const acceptFriendRequest = async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;

        const userExist = await User.findOne({ _id: id });

        if (!userExist) {
            return res.status(404).json({
                success: false,
                message: "Receiver does not exist"
            })
        }

        if (user.friends.includes(id)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends"
            })
        }

        const friendRequestExist = await FriendRequest.findOne({
            $or: [
                { sender: id, receiver: user._id },
                { sender: user._id, receiver: id }
            ]
        }
        );

        if (!friendRequestExist) {
            return res.status(400).json({
                success: false,
                message: "Friend Requets is not present"
            })
        }

        const response = await FriendRequest.findOneAndUpdate(
            {
                $or: [
                    { sender: id, receiver: user._id },
                    { sender: user._id, receiver: id }
                ]
            },
            { status: "accepted" },
            { new: true }
        );


        const senderUpdated = await User.findByIdAndUpdate(id, {
            $push: {
                friends: user._id
            }
        })

        const receiverUpdated = await User.findByIdAndUpdate(user._id, {
            $push: {
                friends: id
            }
        })

        return res.status(200).json({
            success: true,
            message: "Friend request accepted successfully"
        })
    }
    catch (error) {
        console.log("Error occured in acceptFriendRequest function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// notification :- who accepted your friend request
const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const friends = await FriendRequest.find({ sender: userId, status: "accepted" }).sort({ updatedAt: -1 }).populate('receiver').limit(10).exec();

        console.log(friends);

        return res.status(200).json({
            success: true,
            message: "Friends fetched successfully",
            data: friends
        })
    }
    catch (error) {
        console.log("Error occured in getFriends function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// friend request sent by the user to others
const getFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id;

        const friendsRequest = await FriendRequest.find({ receiver: userId, status: "pending" }).populate("sender").exec();

        return res.status(200).json({
            success: true,
            message: "Friend request fetched successfully",
            data: friendsRequest
        })
    }
    catch (error) {
        console.log("Error occured in getFriendRequest function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const outgoingFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id;

        const outgoingFriendRequest = await FriendRequest.find({ sender: userId, status: "pending" });

        return res.status(200).json({
            success: true,
            message: "Outgoing Friend request fetched successfully",
            data: outgoingFriendRequest
        })
    }
    catch (error) {
        console.log("Error occured in outgoingFriendRequest function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const rejectFriendRequest = async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;

        if (user.friends.includes(id)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends"
            })
        }

        const friendRequestExist = await FriendRequest.findOne({
            $or: [
                { sender: id, receiver: user._id },
                { sender: user._id, receiver: id }
            ]
        });

        if (!friendRequestExist) {
            return res.status(400).json({
                success: false,
                message: "Friend Request is not present"
            })
        }

        await FriendRequest.findOneAndDelete({
            $or: [
                { sender: id, receiver: user._id },
                { sender: user._id, receiver: id }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Friend request rejected successfully"
        })
    }
    catch (error) {
        console.log("Error occured in rejectFriendRequest function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const searchFriend = async (req, res) => {
    try {
        const key = req.params.key;
        console.log(key);

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Search Key is requred"
            })
        }

        const userExist = await User.find({
            $or: [
                { email: { $regex: key, $options: "i" } },
                { username: { $regex: key, $options: "i" } }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "User found",
            data: userExist
        })
    }
    catch (error) {
        console.log("Error occured in search friend function", error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = { getRecommendedFriends, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriends, getFriendRequest, outgoingFriendRequest, rejectFriendRequest, searchFriend };