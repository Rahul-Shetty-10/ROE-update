module.exports.admin_dashboard_page = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (!req.session.user || req.session.user.email !== 'republicofengineers.sns@gmail.com') {
        res.redirect('/user_dashboard');
    } else {
        res.render('admin/admin_dashboard');
    }
}