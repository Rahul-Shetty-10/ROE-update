const db = require('../../db/db');

module.exports.placement_registered_users = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!req.session.user || req.session.user.email !== 'republicofengineers.sns@gmail.com') {
        res.redirect('/user_dashboard');
    } else {
        // Query to count the total number of users
        db.query('SELECT COUNT(*) AS Users_count FROM Placement', (error, countResult) => {
            if (error) {
                console.error('Error counting users:', error);
                return res.status(500).send('Internal server error');
            }

            // Total number of users
            const Users_count = countResult.length > 0 ? countResult[0].Users_count : 0;

            // Query to fetch all user details
            db.query('SELECT *, DATE_FORMAT(DOB, "%d-%m-%Y") AS DOB FROM Placement', (error, userResults) => {
                if (error) {
                    console.error('Error fetching users:', error);
                    return res.status(500).send('Internal server error');
                }

                res.render('admin/placement_training_registered', { users: userResults, Users_count: Users_count });
            });
        });
    }
}

module.exports.delete_placement_user = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.query('DELETE FROM Placement WHERE Email = ?', [email]);

    res.redirect('/placement_training_registered')

}
