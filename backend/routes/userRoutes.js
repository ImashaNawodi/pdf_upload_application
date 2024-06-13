const express = require('express');
const router = express.Router();
const { signupUser, loginUser,deleteUser, viewUsers, requestPasswordReset, resetPassword,updateUser,changePassword } = require('../controller/userController');

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);

// View users route
router.get('/users', viewUsers);

// Password reset request route
router.post('/password/reset/request', requestPasswordReset);

// Password reset route
router.post('/reset-password/:resetToken', resetPassword);

router.put('/update/:accountId', updateUser);

// Password reset request route
router.post('/password/reset/request', requestPasswordReset);

// Password reset route
router.post('/reset-password/:resetToken', resetPassword);
//Change Password
router.post('/change/:accountId', changePassword);

//Delete Account
router.delete('/delete/:accountId', deleteUser);

module.exports = router;
