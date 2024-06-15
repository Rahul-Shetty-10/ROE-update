const db = require('../../db/db');

module.exports.profile_page = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.redirect('/');
        }
    
        const email = req.session.user.email;
    
        db.query(`SELECT FirstName, LastName, Email, Phone, DATE_FORMAT(DOB, '%d/%m/%Y') as DOB, Gender, University, College, Branch, Semester FROM Profile WHERE Email = ?`, [email], function (error, results, fields) {
            if (error) {
                console.error('Error fetching profile:', error);
                return res.status(500).json({ error: "Internal server error" });
            }
    
            if (results.length > 0) {
                res.render('user/profile', { user: results[0] });
            } else {
                res.status(404).json({ error: "Profile not found" });
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
}

module.exports.profile = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.email) {
            return res.redirect('/');
        }

        const email = req.session.user.email;
        const { FirstName, LastName, Phone, DOB, Gender, University, College, Branch, Semester } = req.body;

        await db.query('UPDATE Profile SET FirstName = ?, LastName = ?, Phone = ?, DOB = ?, Gender = ?, University = ?, College =?, Branch = ?, Semester = ? WHERE Email = ?', [FirstName, LastName, Phone, DOB, Gender, University, College, Branch, Semester, email]);
        return res.redirect('/profile');

    } catch (error) {
        console.error('Error editing profile:', error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
}
