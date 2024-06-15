const db = require('../../db/db');
const sendVerificationEmail = require('../../helper/sendmail');

module.exports.signup = async (req, res) => {
    const email = req.body.Email;
    const verificationLink = `http://localhost:3000/set_password?email=${email}`;

    const existingUser = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);

    if (existingUser.length > 0) {
        res.render('user/index', { error: 'Email already exists!' });
    } else {
        sendVerificationEmail(email, verificationLink); // Call the function from sendmail.js
        res.render('user/index', { error: `Verification email is sent to ${email}` });
    }
}