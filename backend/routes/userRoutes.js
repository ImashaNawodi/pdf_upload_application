const express = require('express');
const router = express.Router();
const { signupUser, loginUser,deleteUser, requestPasswordReset, resetPassword,changePassword } = require('../controller/userController');

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);


// Password reset request route
router.post('/password/reset/request', requestPasswordReset);

// Password reset route
router.post('/reset-password/:resetToken', resetPassword);


// Password reset request route
router.post('/password/reset/request', requestPasswordReset);

// Password reset route
router.post('/reset-password/:resetToken', resetPassword);

//Change Password
router.post('/change/:accountId', changePassword);

//Delete Account
router.delete('/delete/:accountId', deleteUser);

module.exports = router;
