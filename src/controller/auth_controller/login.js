const db = require('../../db/db');
const bcrypt = require('bcrypt');


module.exports.login = async (req, res) => {
    const { Email, Password } = req.body;

    try {
        db.query('SELECT * FROM Users WHERE Email = ?', [Email], async function (error, results, fields) {
            if (error) {
                throw error;
            }

            if (results.length === 0) {
                return res.render('user/index', { error: "Email does not exist!" });
            } else {
                const user = results[0];
                const hashedPassword = user.Password;

                if (!Password || !hashedPassword) {
                    console.error('Password or hashedPassword is undefined');
                    return res.render('user/index', { error: "Password is undefined" });
                }

                try {
                    const match = await bcrypt.compare(Password, hashedPassword);

                    if (match) {
                        db.query('UPDATE Users SET LastLogin = current_timestamp() WHERE Email = ?', [Email], function (error, results, fields) {
                            if (error) {
                                throw error;
                            }
                            req.session.user = { email: Email }; 
                            if (Email === 'republicofengineers.sns@gmail.com') {
                                res.redirect('/admin_dashboard');
                            } else {
                                res.redirect('/user_dashboard');
                            }
                        });
                    } else {
                        return res.render('user/index', { error: "Invalid password!" });
                    }
                } catch (bcryptError) {
                    console.error('Error comparing passwords:', bcryptError);
                    return res.status(500).json({ error: "Internal server error" });
                }
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: "Internal server error" });
    }
    }

