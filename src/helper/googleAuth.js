const db = require('../db/db');

async function handleGoogleCallback(req, res) {
    try {
        const { email, given_name, family_name, picture, id } = req.user;

        db.query('SELECT * FROM Users WHERE Email = ?', [email], async function (error, results) {
            if (error) {
                throw error;
            }

            if (results.length > 0) {
                db.query('UPDATE Users SET FirstName = ?, LastName = ?, ProfilePictureURL = ?, GoogleUserID = ?, LastLogin = current_timestamp() WHERE Email = ?', [given_name, family_name, picture, id, email], function (error, results, fields) {
                    if (error) {
                        throw error;
                    }
                    req.session.user = { email: email };
                    if (email === 'republicofengineers.sns@gmail.com') {
                        res.redirect('/admin_dashboard');
                    } else {
                        res.redirect('/user_dashboard');
                    }
                });
            } else {
                const newUser = {
                    Email: email,
                    FirstName: given_name,
                    LastName: family_name,
                    ProfilePictureURL: picture,
                    GoogleUserID: id
                };

                db.query('INSERT INTO Users SET ?', newUser, function (error, results, fields) {
                    if (error) {
                        throw error;
                    }
                    db.query('INSERT INTO Profile (Email) VALUES (?)', [email], function (profileError, profileResults, profileFields) {
                        if (profileError) {
                            console.error('Error inserting into Profile table:', profileError);
                            return res.status(500).json({ error: "Internal server error" });
                        }
                        req.session.user = { email: email };
                        if (email === 'republicofengineers.sns@gmail.com') {
                            res.redirect('/admin_dashboard');
                        } else {
                            res.redirect('/user_dashboard');
                        }
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error inserting or updating user data in database:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    handleGoogleCallback
};
