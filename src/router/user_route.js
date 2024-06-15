const express = require('express')
const router = express.Router()
const { upload } = require('../helper/uploads');

const userdashboardController = require('../controller/user_controller/user_dashboard')
const userplacementController = require('../controller/user_controller/placement')
const userprofileController = require('../controller/user_controller/profile')

router.get('/user_dashboard', userdashboardController.dashboard_page);

router.get('/placement', userplacementController.placement_page);
router.post('/placement', upload.single('Payment_Screenshot'), userplacementController.placement);

router.get('/profile', userprofileController.profile_page);
router.post('/profile', userprofileController.profile);

module.exports = router