const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const validator = require("validator");

const createAuthToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
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

// Function to send email after successful signup
const sendSignupEmail = async (email, accountId) => {
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
      subject: "Welcome to PDF Manager",
      html: `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #333;">Welcome to PDF Manager!</h2>
  <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
  <p style="font-size: 16px; line-height: 1.6;">Thank you for signing up with PDF Manager. Your account has been successfully created.</p>
  <p style="font-size: 14px; color: #333; font-weight: bold;">Your account ID is: ${accountId}. Please remember it for login next time.</p>
  <p style="font-size: 14px; color: #777;">If you have any questions or need assistance, please feel free to contact us.</p>
  <p style="font-size: 14px; color: #777;">Thank you,</p>
  <p style="font-size: 14px; color: #777;">PDF Manager Team</p>
</div>

      `,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

// Signup user
const signupUser = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    // Generate account ID
    const accountId = await generateAccountId();

    // Sign up user with the generated account ID
    const user = await User.signup(email, password, fullName, accountId);

    // Send signup email
    await sendSignupEmail(email, accountId); // Pass accountId here

    // Create an authentication token
    const authToken = createAuthToken(user._id);

    // Return response with user data and token
    res
      .status(200)
      .json({ userId: user._id, email, authToken, fullName, accountId });
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6;">You have requested a password reset. Click the following link to reset your password:</p>
          <p style="text-align: center;">
            <a href="http://localhost:3000/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
          </p>
          <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
          <p style="font-size: 14px; color: #777;">Thank you,</p>
          <p style="font-size: 14px; color: #777;">Pdf Manager</p>
        </div>
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

    res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
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
    const latestAccount = await User.findOne(
      {},
      {},
      { sort: { accountId: -1 } }
    );

    // If latestAccount exists, increment the account ID
    if (latestAccount && latestAccount.accountId) {
      const lastIdNumber = parseInt(latestAccount.accountId.slice(3), 10);
      const newIdNumber = lastIdNumber + 1;
      const newAccountId = `ACC${newIdNumber.toString().padStart(3, "0")}`;
      return newAccountId;
    } else {
      // If no existing accounts found, start with the first ID
      return "ACC001";
    }
  } catch (error) {
    console.error("Error generating accountId:", error);
    throw new Error("Error generating account ID");
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
      return res
        .status(400)
        .json({ error: "Current password and new password are required" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Check password strength
    if (!isStrongPassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "New password is not strong enough" });
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

module.exports = {
  signupUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  deleteUser,
};
