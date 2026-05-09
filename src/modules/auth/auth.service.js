const db = require("../../config/db");
const crypto = require("crypto");
const { generateToken } = require("../../utils/jwt");

/**
 * Generate 4-digit OTP
 */
const generateOtp = () => {
  return crypto
    .randomInt(1000, 10000)
    .toString();
};

/**
 * Request OTP
 */
const requestOtp = async ({
  phone_number,
  ip,
}) => {
  /**
   * Validation
   */
  if (
    !phone_number ||
    !/^[6-9]\d{9}$/.test(
      phone_number
    )
  ) {
    throw new Error(
      "Invalid phone number"
    );
  }

  /**
   * Rate limit
   * Max 3 OTP requests per minute
   */
  const oneMinuteAgo =
    new Date(
      Date.now() - 60 * 1000
    ).toISOString();

  const {
    data: recentRequests,
    error: rateError,
  } = await db
    .from("otp_sessions")
    .select("id")
    .eq(
      "phone_number",
      phone_number
    )
    .gte(
      "created_at",
      oneMinuteAgo
    );

  if (rateError) {
    throw new Error(
      "Failed to validate OTP requests"
    );
  }

  if (
    recentRequests &&
    recentRequests.length >= 3
  ) {
    throw new Error(
      "Too many OTP requests. Try again later."
    );
  }

  /**
   * Generate OTP
   */
  const otp_code =
    generateOtp();

  /**
   * OTP expiry (5 mins)
   */
  const expires_at = new Date(
    Date.now() + 5 * 60 * 1000
  ).toISOString();

  /**
   * Save OTP session
   */
  const {
    data,
    error,
  } = await db
    .from("otp_sessions")
    .insert([
      {
        phone_number,
        otp_code,
        expires_at,
        verified: false,
        attempts: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(
      "Failed to create OTP session"
    );
  }

  /**
   * TEMPORARY
   * SMS provider later
   */
  console.log(
    `📲 OTP for ${phone_number}: ${otp_code}`
  );

  return {
    sent: true,

    otp_session_id: data.id,

    expires_at,
  };
};

const verifyOtp = async ({
  phone_number,
  otp_code,
}) => {
  /**
   * Validation
   */
  if (
    !phone_number ||
    !/^[6-9]\d{9}$/.test(
      phone_number
    )
  ) {
    throw new Error(
      "Invalid phone number"
    );
  }

  if (
    !otp_code ||
    !/^\d{4}$/.test(
      otp_code
    )
  ) {
    throw new Error(
      "Invalid OTP"
    );
  }

  /**
   * Get latest OTP session
   */
  const {
    data: otpSession,
    error: fetchError,
  } = await db
    .from("otp_sessions")
    .select("*")
    .eq(
      "phone_number",
      phone_number
    )
    .order(
      "created_at",
      { ascending: false }
    )
    .limit(1)
    .single();

  if (fetchError) {
    throw new Error(
      "Failed to fetch OTP"
    );
  }

  if (!otpSession) {
    throw new Error(
      "Invalid or expired OTP"
    );
  }

  /**
   * Already verified
   */
  if (
    otpSession.verified
  ) {
    throw new Error(
      "OTP already used"
    );
  }

  /**
   * Attempt limit
   */
  const attempts =
    otpSession.attempts || 0;

  if (attempts >= 5) {
    throw new Error(
      "Too many attempts"
    );
  }

  /**
   * Incorrect OTP
   */
  if (
    otpSession.otp_code !==
    otp_code
  ) {
    await db
      .from("otp_sessions")
      .update({
        attempts:
          attempts + 1,
      })
      .eq(
        "id",
        otpSession.id
      );

    throw new Error(
      "Incorrect OTP"
    );
  }

  /**
   * Expiry check
   */
  const now =
    new Date();

  const expiresAt =
    new Date(
      otpSession.expires_at
    );

  if (expiresAt < now) {
    throw new Error(
      "OTP expired"
    );
  }

  /**
   * Mark OTP verified
   */
  const {
    error: updateError,
  } = await db
    .from("otp_sessions")
    .update({
      verified: true,
    })
    .eq(
      "id",
      otpSession.id
    );

  if (updateError) {
    throw new Error(
      "Failed to verify OTP"
    );
  }

  /**
   * Find existing user
   */
  let {
    data: user,
    error: userError,
  } = await db
    .from("users")
    .select("*")
    .eq(
      "phone_number",
      phone_number
    )
    .maybeSingle();

  if (userError) {
    throw new Error(
      "Failed to fetch user"
    );
  }

  /**
   * Create user if not exists
   */
  let is_existing_user =
    true;

  if (!user) {
    is_existing_user =
      false;

    const {
      data: newUser,
      error: createError,
    } = await db
      .from("users")
      .insert([
        {
          phone_number,
          is_verified: true,
        },
      ])
      .select()
      .single();

    if (createError) {
      throw new Error(
        "Failed to create user"
      );
    }

    user = newUser;
  }

  /**
   * Generate JWT
   */
  const token =
    generateToken({
      user_id: user.id,
      phone_number: user.phone_number,
    });

  /**
   * Final response
   */
  return {
    token,

    user: {
      id: user.id,

      phone_number:
        user.phone_number,

      onboarding_completed:
        user.onboarding_completed,
    },

    is_existing_user,
  };
};



module.exports = {
  requestOtp,
  verifyOtp
};
