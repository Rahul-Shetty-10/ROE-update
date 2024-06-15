const db = require('../../db/db');
const sendVerificationEmail = require('../../helper/sendmail');
const bcrypt = require('bcrypt');

module.exports.forgot_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.render('password/forgot');
}

module.exports.forgot = async (req, res) => {
    const email = req.body.Email;
    const verificationLink = `http://localhost:3000/new_password?email=${email}`;

    const exisitngUser = db.query('SELECT * FROM Users WHERE Email = ?', [email]);

    if (exisitngUser.length === 0) {
        return res.render('user/index', { error: 'Email does not exists!' });
    } else {
        sendVerificationEmail(email, verificationLink);
        return res.render('user/index', { error: `Verification email is sent to ${email}` });
    }
}

module.exports.set_password_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log(req.session);

    if (!req.query.email) {
        res.redirect('/');
    } else {
        req.session.email = req.query.email; // Store the email in session
        res.render('password/set_password', { email: req.query.email }); // Pass the email variable to the view
    }
}

module.exports.set_password = async (req, res) => {
    const email = req.body.email;
    const password = req.body.Password;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO Users (Email, Password) VALUES (?, ?)', [email, hashedPassword]);

        db.query('INSERT INTO Profile (Email) VALUES (?)', [email]);
        req.session.user = { email: email };
        if (email === 'republicofengineers.sns@gmail.com') {
            res.redirect('/admin_dashboard');
        } else {
            res.redirect('/user_dashboard');
        }

    } catch (error) {
        console.error('Error setting password:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.new_password_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log(req.session);

    if (!req.query.email) {
        res.redirect('/');
    } else {
        req.session.email = req.query.email; // Store the email in session
        res.render('password/new_password', { email: req.query.email }); // Pass the email variable to the view
    }
}

module.exports.new_password = async (req, res) => {
    const email = req.body.email; // Assuming the email is sent with the form data
    const password = req.body.Password;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('UPDATE Users SET Password = ? WHERE Email = ?', [hashedPassword, email]);
        req.session.user = { email: email };
        if (email === 'republicofengineers.sns@gmail.com') {
            res.redirect('/admin_dashboard');
        } else {
            res.redirect('/user_dashboard');
        }

    } catch (error) {
        console.error('Error setting password:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.cancel_signin = async (req, res) => {
    res.redirect('/');
}