const db = require('../../config/db');

/**
 * Update preferred language
 */
const updateLanguage = async ({
  userId,
  preferred_language,
}) => {
  /**
   * Validate user
   */
  if (!userId) {
    throw new Error(
      'User ID is required',
    );
  }

  /**
   * Validate language
   */
  if (!preferred_language) {
    throw new Error(
      'Language is required',
    );
  }

  /**
   * Clean value
   */
  const cleanLanguage =
    preferred_language.trim();

  /**
   * Prevent invalid values
   */
  if (
    cleanLanguage.length < 2
  ) {
    throw new Error(
      'Invalid language',
    );
  }

  /**
   * Update users table
   */
  const {
    data: userData,
    error: userError,
  } = await db
    .from('users')
    .update({
      preferred_language:
        cleanLanguage,

      /**
       * Move onboarding
       */
      // onboarding_step:
      //   'name',
    })
    .eq('id', userId)
    .select()
    .single();

  /**
   * User DB error
   */
  if (userError) {
    throw new Error(
      userError.message,
    );
  }

  /**
   * Missing user
   */
  if (!userData) {
    throw new Error(
      'User not found',
    );
  }

  /**
   * Update onboarding profile
   */
  const {
    data: profileData,
    error: profileError,
  } = await db
    .from(
      'onboarding_profiles',
    )
    .upsert(
      {
        user_id: userId,

        language:
          cleanLanguage,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          'user_id',
      },
    )
    .select()
    .single();

  /**
   * Profile error
   */
  if (profileError) {
    throw new Error(
      profileError.message,
    );
  }

  /**
   * Return merged user
   */
  return {
    user: {
      ...userData,

      onboarding_profile:
        profileData,
    },
  };
};

/**
 * Update name
 */
const updateName = async ({
  userId,
  name,
}) => {
  /**
   * Validate user
   */
  if (!userId) {
    throw new Error(
      'User ID is required',
    );
  }

  /**
   * Validate name
   */
  if (!name) {
    throw new Error(
      'Name is required',
    );
  }

  /**
   * Clean value
   */
  const cleanName =
    name.trim();

  /**
   * Min validation
   */
  if (
    cleanName.length < 3
  ) {
    throw new Error(
      'Name must be minimum 3 characters',
    );
  }

  /**
   * Max validation
   */
  if (
    cleanName.length > 32
  ) {
    throw new Error(
      'Name is too long',
    );
  }

  /**
   * Update users table
   */
  const {
    data: userData,
    error: userError,
  } = await db
    .from('users')
    .update({
      name: cleanName,

      /**
       * Move onboarding
       */
      onboarding_step:
        'gender',
    })
    .eq('id', userId)
    .select()
    .single();

  /**
   * User DB error
   */
  if (userError) {
    throw new Error(
      userError.message,
    );
  }

  /**
   * Missing user
   */
  if (!userData) {
    throw new Error(
      'User not found',
    );
  }

  /**
   * Update onboarding profile
   */
  const {
    data: profileData,
    error: profileError,
  } = await db
    .from(
      'onboarding_profiles',
    )
    .upsert(
      {
        user_id: userId,

        companion_name:
          cleanName,

        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          'user_id',
      },
    )
    .select()
    .single();

  /**
   * Profile error
   */
  if (profileError) {
    throw new Error(
      profileError.message,
    );
  }

  /**
   * Return merged user
   */
  return {
    user: {
      ...userData,

      onboarding_profile:
        profileData,
    },
  };
};

/**
 * Update gender
 */
const updateGender = async ({
  userId,
  gender,
}) => {
  /**
   * Validate user
   */
  if (!userId) {
    throw new Error(
      'User ID is required',
    );
  }

  /**
   * Validate gender
   */
  if (!gender) {
    throw new Error(
      'Gender is required',
    );
  }

  /**
   * Allowed values
   */
  const allowedGenders = [
    'male',
    'female',
    'non_binary',
    'prefer_not_say',
  ];

  /**
   * Prevent invalid value
   */
  if (
    !allowedGenders.includes(
      gender,
    )
  ) {
    throw new Error(
      'Invalid gender',
    );
  }

  /**
   * Update users table
   */
  const {
    data: userData,
    error: userError,
  } = await db
    .from('users')
    .update({
      gender,

      /**
       * Move onboarding
       */
      onboarding_step:
        'vibe',
    })
    .eq('id', userId)
    .select()
    .single();

  /**
   * User DB error
   */
  if (userError) {
    throw new Error(
      userError.message,
    );
  }

  /**
   * Missing user
   */
  if (!userData) {
    throw new Error(
      'User not found',
    );
  }

  /**
   * Get onboarding profile
   */
  const {
    data: profileData,
    error: profileError,
  } = await db
    .from(
      'onboarding_profiles',
    )
    .select('*')
    .eq(
      'user_id',
      userId,
    )
    .maybeSingle();

  /**
   * Profile error
   */
  if (profileError) {
    throw new Error(
      profileError.message,
    );
  }

  /**
   * Return merged user
   */
  return {
    user: {
      ...userData,

      onboarding_profile:
        profileData || null,
    },
  };
};

module.exports = {
  updateLanguage,
  updateName,
  updateGender,
};