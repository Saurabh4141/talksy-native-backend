const authService = require("./auth.service");

const SAFE_ERRORS = [
  "Invalid phone number",
  "Too many OTP requests. Try again later.",
];

/**
 * Request OTP
 */
const requestOtp = async (req, res) => {
  try {
    /**
     * Body validation
     */
    if (
      !req.body ||
      !req.body.phone_number
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const phone_number =
      req.body.phone_number;

    /**
     * Indian mobile validation
     */
    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (
      !phoneRegex.test(phone_number)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    /**
     * Extract IP
     */
    let ip =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      req.ip ||
      null;

    /**
     * Handle proxy chains
     */
    if (
      ip &&
      ip.includes(",")
    ) {
      ip = ip
        .split(",")[0]
        .trim();
    }

    /**
     * Normalize IPv6 localhost
     */
    if (
      ip &&
      ip.startsWith("::ffff:")
    ) {
      ip = ip.replace(
        "::ffff:",
        ""
      );
    }

    /**
     * Request OTP service
     */
    const result =
      await authService.requestOtp({
        phone_number,
        ip,
      });

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully",
      data: result,
    });
  } catch (err) {
    console.error(
      "❌ requestOtp error:",
      err
    );

    const message =
      SAFE_ERRORS.includes(
        err.message
      )
        ? err.message
        : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};


const verifyOtp = async (req, res) => {
  try {
    /**
     * Body validation
     */
    if (
      !req.body ||
      !req.body.phone_number ||
      !req.body.otp_code
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number and OTP are required",
      });
    }

    const {
      phone_number,
      otp_code,
    } = req.body;

    /**
     * Verify OTP service
     */
    const result =
      await authService.verifyOtp({
        phone_number,
        otp_code,
      });

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
      data: result,
    });
  } catch (err) {
    console.error(
      "❌ verifyOtp error:",
      err
    );

    const safeMessages = [
      "Invalid phone number",
      "Invalid OTP",
      "Incorrect OTP",
      "OTP expired",
      "Too many attempts",
      "OTP already used",
    ];

    const message =
      safeMessages.includes(
        err.message
      )
        ? err.message
        : "Something went wrong";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};



module.exports = {
  requestOtp,
  verifyOtp
};
