const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const validator = require('validator');

const createAuthToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const createResetToken = (_id) => {
  return jwt.sign({ _id }, process.env.RESET_SECRET, { expiresIn: "1h" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password, accountId } = req.body;
  try {
    const user = await User.login(email, password, accountId);
    // create an authentication token
    const authToken = createAuthToken(user._id);

    res.status(200).json({ email, authToken, accountId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password,fullName } = req.body;
  try {
    // Generate account ID
    const accountId = await generateAccountId();

    // Sign up user with the generated account ID
    const user = await User.signup(email, password, fullName, accountId);

    // create an authentication token
    const authToken = createAuthToken(user._id);

    // Return the user ID along with other data
    res.status(200).json({ userId: user._id, email, authToken, fullName, accountId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You have requested a password reset. Click the following link to reset your password:</p>
        <a href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
      `,
    });

    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};

// Reset password request
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = createResetToken(user._id);

    // Save reset token to user document
    user.resetToken = resetToken;
    await user.save();

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(400).json({ error: error.message });
  }
};




// Reset password
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  try {
    if (!resetToken) {
      throw new Error("Reset token must be provided");
    }
    // Decode reset token
    const decodedToken = jwt.verify(resetToken, process.env.RESET_SECRET);

    // Find user by decoded token
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new Error("User not found");
    }
// Check password strength
if (!isStrongPassword(newPassword)) {
  throw new Error("Password is not strong enough");
}
    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password with the hashed password
    user.password = hashedPassword;
    user.resetToken = null; // Clear reset token
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(400).json({ error: error.message });
  }
};

const isStrongPassword = (password) => {
  // Use validator's isStrongPassword method
  return validator.isStrongPassword(password);
};

// Refactored generateAccountId function to be used internally
const generateAccountId = async () => {
  try {
    const latestAccount = await User.findOne({}, {}, { sort: { accountId: -1 } });

    // If latestAccount exists, increment the account ID
    if (latestAccount && latestAccount.accountId) {
      const lastIdNumber = parseInt(latestAccount.accountId.slice(3), 10);
      const newIdNumber = lastIdNumber + 1;
      const newAccountId = `ACC${newIdNumber.toString().padStart(3, '0')}`;
      return newAccountId;
    } else {
      // If no existing accounts found, start with the first ID
      return 'ACC001';
    }
  } catch (error) {
    console.error("Error generating accountId:", error);
    throw new Error("Error generating account ID");
  }
};

const viewUsers = async (req, res) => {
  User.find().then((Users) => {
    res.json(Users);
  }).catch((err) => {
    console.log(err);
  });
};

// Update user details
const updateUser = async (req, res) => {
  const { accountId } = req.params;
  const { fullName, email } = req.body;

  const updateUser = {
 
   fullName,
    email,
  };

  try {
    console.log("Updating user with accountId:", accountId);
    console.log("New user data:", updateUser);

    const updatedUser = await User.findOneAndUpdate({ accountId }, updateUser, { new: true });
    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ status: "User not found" });
    }
    res.status(200).json({ status: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error with updating User", error: err.message });
  }
};

// Change password


const changePassword = async (req, res) => {
  const { accountId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by accountId
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Check password strength
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ error: "New password is not strong enough" });
    }

    // Encrypt the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password with the hashed password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  // Extract accountId from request parameters
  const { accountId } = req.params;

  try {
    // Find and delete the user by accountId
    const deletedUser = await User.findOneAndDelete({ accountId });

    // Check if user exists
    if (!deletedUser) {
      return res.status(404).send({ status: "User not found" });
    }

    // Send success response
    res.status(200).send({ status: "User deleted" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).send({ status: "Error with delete user" });
  }
};




module.exports = { signupUser, loginUser, viewUsers, requestPasswordReset, resetPassword, updateUser, changePassword, deleteUser };