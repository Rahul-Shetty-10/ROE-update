const db = require('../../db/db');

module.exports.news_letter_users = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!req.session.user || req.session.user.email !== 'republicofengineers.sns@gmail.com') {
        res.redirect('/user_dashboard');
    } else {
        // Query to count the total number of users
        db.query('SELECT COUNT(*) AS Users_count FROM News_Letter', (error, countResult) => {
            if (error) {
                console.error('Error counting users:', error);
                return res.status(500).send('Internal server error');
            }
            
            // Total number of users
            const Users_count = countResult.length > 0 ? countResult[0].Users_count : 0;

            // Query to fetch all user details
            db.query('SELECT *, DATE_FORMAT(JoinedAt, "%d-%m-%Y") AS JoinedAt FROM News_Letter', (error, userResults) => {
                if (error) {
                    console.error('Error fetching users:', error);
                    return res.status(500).send('Internal server error');
                }

                res.render('admin/news_users', { users: userResults, Users_count: Users_count });
            });
        });
    }
}

module.exports.delete_news_user = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.query('DELETE FROM News_Letter WHERE Email = ?', [email]);

       res.redirect('/news_users')
}
