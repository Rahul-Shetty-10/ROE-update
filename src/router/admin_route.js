const express = require('express')
const router = express.Router()

const adminController = require('../controller/admin_controller/admin_controls')
const adminplacementController = require('../controller/admin_controller/placement_training_registered')
const admintotalusersController = require('../controller/admin_controller/total_users')
const adminnewsusersController = require('../controller/admin_controller/news_users')
const adminuserprofilesController = require('../controller/admin_controller/user_profiles')

router.get('/admin_dashboard', adminController.admin_dashboard_page);

router.get('/placement_training_registered', adminplacementController.placement_registered_users);
router.post('delete_placement_user', adminplacementController.delete_placement_user);

router.get('/total_users', admintotalusersController.total_users_page);
router.post('/delete_user', admintotalusersController.delete_user);

router.get('/news_users', adminnewsusersController.news_letter_users);
router.post('/delete_news_user', adminnewsusersController.delete_news_user);

router.get('/user_profile', adminuserprofilesController.user_profiles);
module.exports = router