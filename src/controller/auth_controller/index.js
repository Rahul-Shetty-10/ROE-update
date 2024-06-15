const db = require('../../db/db');

module.exports.index_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.render('user/index', {error:''})
}

module.exports.news_letter = async (req, res) => {
    const email = req.body.Email; 

    try {
        const existingUser = await db.query('SELECT * FROM News_letter WHERE Email = ?', [email]);
        
        if (existingUser.length > 0) {
            return res.render('user/index', { error: 'Email is already subscribed to the newsletter' });
        }

        db.query('INSERT INTO News_letter (Email) VALUES (?)', [email])
            res.render('user/index', { error: 'Successfully joined our News Letter' });
        
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
}