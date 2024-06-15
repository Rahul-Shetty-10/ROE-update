const db = require('../../db/db');

module.exports.total_users_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!req.session.user || req.session.user.email !== 'republicofengineers.sns@gmail.com') {
        res.redirect('/user_dashboard');
    } else {
        db.query('SELECT COUNT(*) AS Users_count FROM Users', (countErr, countResult) => {
            if (countErr) {
                console.error('Error retrieving user count:', countErr);
                return res.status(500).json({ error: 'Internal server error' });
            }
            const Users_count = countResult.length > 0 ? countResult[0].Users_count : 0;

            db.query('SELECT Email, FirstName, LastName, DATE_FORMAT(CreatedAt, "%d-%m-%Y %H:%i:%s") AS CreatedAt, DATE_FORMAT(LastLogin, "%Y-%m-%d %H:%i:%s") AS LastLogin FROM Users', (userErr, userResults) => {
                if (userErr) {
                    console.error('Error retrieving user data:', userErr);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.render('admin/total_users', { users: userResults, Users_count: Users_count });
            });
        });
    }
}

module.exports.delete_user = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        db.query('DELETE FROM Users WHERE Email = ?', [email], (deleteErr) => {
            if (deleteErr) {
                console.error('Error deleting user:', deleteErr);
                return db.rollback(() => {
                    res.status(500).json({ error: 'Internal server error' });
                });
            }

            db.query('DELETE FROM Profile WHERE Email = ?', [email], (profileDeleteErr) => {
                if (profileDeleteErr) {
                    console.error('Error deleting user profile:', profileDeleteErr);
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Internal server error' });
                    });
                }

                db.commit((commitErr) => {
                    if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Internal server error' });
                        });
                    }
                    res.redirect('/total_users'); // Assuming correct route
                });
            });
        });
    });
}
