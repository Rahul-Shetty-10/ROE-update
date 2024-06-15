module.exports.dashboard_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log('cache');
    console.log(req.session);

    if (!req.session.user || !req.session.user.email) {
        res.redirect('/');
    } else {
        res.render('user/user_dashboard');
    }
}