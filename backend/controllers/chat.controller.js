const {generateStreamToken} = require('../utils/stream');

const getChatToken = async (req,res) => {
    try 
    {
        const userId = req.user._id;

        const streamToken = generateStreamToken(userId);

        return res.status(200).json({
            success : true,
            message : "Stream token generated successfully",
            data : streamToken
        })
    }
    catch(error)
    {
        console.log("Error occured at getChatToken function",error.message);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

module.exports = {getChatToken};