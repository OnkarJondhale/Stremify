const { transporter } = require('../config/nodemailer');

exports.mailSender = async (title,email,body)=>
{
    try 
    {
        const response = await transporter.sendMail({
            from : "streamify@gmail.com",
            to : email,
            subject : title,
            html : body
        })

        return response;
    }
    catch(error)
    {   
        console.log("Error occured at mailsender",error.message);
        return new Error("Error has occured while sending the email")
    }
}
