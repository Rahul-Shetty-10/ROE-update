const db = require('../../db/db');

module.exports.user_profiles = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!req.session.user || req.session.user.email !== 'republicofengineers.sns@gmail.com') {
        res.redirect('/user_dashboard');
    } else {
    
    db.query('SELECT *, DATE_FORMAT(DOB, "%d-%m-%Y") AS DOB FROM Profile', (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).send('Internal server error');
        }
        res.render('admin/user_profile', { users: results });
    });
}
}
