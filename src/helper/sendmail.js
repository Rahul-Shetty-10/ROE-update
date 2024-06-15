const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      accessToken: process.env.ACCESS_TOKEN
    }
  });
  

function sendVerificationEmail(email, verificationLink) {
    const mailOptions = {
        from: 'republicofengineers.sns@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email and set password by clicking the following link: ${verificationLink}`,
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email', error);
            return;
        }
        console.log('Message sent: %s', info.messageId);
    });
}

module.exports = sendVerificationEmail;
