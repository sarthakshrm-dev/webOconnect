const express = require('express');
const profileController = require('../controllers/profileController');
const JSWAuth = require('../middlewares/JSWAuth')

const router = express.Router();

router.get('/fetch-all', JSWAuth, profileController.getData);
router.put('/update-profile', JSWAuth, profileController.updateProfile);
router.put('/change-password', JSWAuth, profileController.changePassword);
router.delete('/delete', JSWAuth, profileController.deleteAccount);

module.exports = router;