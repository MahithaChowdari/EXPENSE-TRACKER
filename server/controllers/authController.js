import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ======================================================
// BREVO SMTP CONFIGURATION
// ======================================================

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

// ======================================================
// TEST BREVO CONNECTION
// ======================================================

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Brevo SMTP connection failed:");
    console.error(error.message);
  } else {
    console.log("✅ Brevo SMTP connection successful!");
  }
});

// ======================================================
// REGISTER USER
// ======================================================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
    } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim();

    const existingEmail = await User.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existingUsername = await User.findOne({
      username: cleanUsername,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      fullName: fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",

      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ======================================================
// LOGIN USER
// ======================================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("");
    console.log("========================================");
    console.log("📧 FORGOT PASSWORD REQUEST");
    console.log("========================================");
    console.log("Email received:", email);

    // --------------------------------------------------
    // Validate email
    // --------------------------------------------------

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // --------------------------------------------------
    // Find user
    // --------------------------------------------------

    const user = await User.findOne({
      email: cleanEmail,
    });

    console.log(
      "User found:",
      user ? user.email : "NO USER"
    );

    // --------------------------------------------------
    // Don't reveal whether email exists
    // --------------------------------------------------

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // --------------------------------------------------
    // Generate reset token
    // --------------------------------------------------

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    console.log(
      "Reset token generated successfully"
    );

    // --------------------------------------------------
    // Hash token before storing
    // --------------------------------------------------

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // 15 minute expiration
    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log(
      "Reset token saved to MongoDB"
    );

    // --------------------------------------------------
    // Create reset URL
    // --------------------------------------------------

    const frontendURL =
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    const resetURL =
      `${frontendURL}/reset-password/${resetToken}`;

    console.log("");
    console.log("🔗 RESET URL:");
    console.log(resetURL);
    console.log("");

    // --------------------------------------------------
    // Check email configuration
    // --------------------------------------------------

    if (!process.env.EMAIL_USER) {
      throw new Error(
        "EMAIL_USER is missing from .env"
      );
    }

    if (!process.env.EMAIL_PASSWORD) {
      throw new Error(
        "EMAIL_PASSWORD is missing from .env"
      );
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error(
        "EMAIL_FROM is missing from .env"
      );
    }

    // --------------------------------------------------
    // Send email
    // --------------------------------------------------

    console.log("📨 Sending password reset email...");

    const mailResult = await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_FROM}>`,

      to: user.email,

      subject:
        "Expense Tracker - Password Reset",

      text: `
Hello ${user.fullName || "User"},

We received a request to reset your Expense Tracker password.

Open this link to reset your password:

${resetURL}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Expense Tracker
      `,

      html: `
<!DOCTYPE html>

<html>
<head>
  <meta charset="UTF-8" />
  <title>Password Reset</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f8fafc;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:16px;
      padding:35px;
      border:1px solid #e5e7eb;
      box-shadow:0 5px 20px rgba(0,0,0,0.05);
    "
  >

    <h1
      style="
        color:#2563eb;
        margin-bottom:10px;
      "
    >
      Expense Tracker
    </h1>

    <h2>
      Password Reset Request
    </h2>

    <p>
      Hello ${user.fullName || "User"},
    </p>

    <p>
      We received a request to reset
      your Expense Tracker password.
    </p>

    <p>
      Click the button below to create
      a new password.
    </p>

    <div
      style="
        text-align:center;
        margin:30px 0;
      "
    >

      <a
        href="${resetURL}"
        style="
          display:inline-block;
          background:#2563eb;
          color:#ffffff;
          padding:14px 28px;
          text-decoration:none;
          border-radius:10px;
          font-weight:bold;
        "
      >
        Reset Password
      </a>

    </div>

    <p>
      This link will expire in
      <strong>15 minutes</strong>.
    </p>

    <p>
      If you did not request a password
      reset, you can safely ignore this email.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:30px 0;
      "
    />

    <p
      style="
        color:#6b7280;
        font-size:12px;
      "
    >
      Expense Tracker
    </p>

  </div>

</body>
</html>
      `,
    });

    // --------------------------------------------------
    // Email successfully sent
    // --------------------------------------------------

    console.log("");
    console.log("========================================");
    console.log("✅ PASSWORD RESET EMAIL SENT");
    console.log("========================================");
    console.log("Message ID:", mailResult.messageId);
    console.log("Accepted:", mailResult.accepted);
    console.log("Rejected:", mailResult.rejected);
    console.log("Recipient:", user.email);
    console.log("========================================");
    console.log("");

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {

    console.error("");
    console.error("========================================");
    console.error("❌ FORGOT PASSWORD ERROR");
    console.error("========================================");
    console.error(error);
    console.error("========================================");
    console.error("");

    return res.status(500).json({
      success: false,
      message:
        "Unable to send password reset email. Please try again later.",
    });
  }
};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("");
    console.log("========================================");
    console.log("🔐 RESET PASSWORD REQUEST");
    console.log("========================================");

    // --------------------------------------------------
    // Validate token
    // --------------------------------------------------

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    // --------------------------------------------------
    // Validate password
    // --------------------------------------------------

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // --------------------------------------------------
    // Hash token
    // --------------------------------------------------

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // --------------------------------------------------
    // Find user with valid token
    // --------------------------------------------------

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      console.log(
        "❌ Invalid or expired reset token"
      );

      return res.status(400).json({
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    // --------------------------------------------------
    // Hash new password
    // --------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // --------------------------------------------------
    // Invalidate reset token
    // --------------------------------------------------

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    console.log(
      "✅ Password successfully reset for:",
      user.email
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login.",
    });

  } catch (error) {

    console.error(
      "❌ Reset Password Error:",
      error
    );

    return res.status(500).json({
      message: "Server Error",
    });
  }
};