const db = require('../../config/db');

const updateLanguage = async ({
  userId,
  preferred_language,
}) => {
  /**
   * Validate
   */
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!preferred_language) {
    throw new Error('Language is required');
  }

  /**
   * Update DB
   */
  const { data, error } = await db
    .from('users')
    .update({
      preferred_language,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('User not found');
  }

  return {
    user: data,
  };
};

const updateName = async ({
  userId,
  name,
}) => {
  /**
   * Validate
   */
  if (!userId) {
    throw new Error(
      'User ID is required',
    );
  }

  if (!name) {
    throw new Error(
      'Name is required',
    );
  }

  /**
   * Update DB
   */
  const { data, error } =
    await db
      .from('users')
      .update({
        name,
      })
      .eq('id', userId)
      .select()
      .single();

  if (error) {
    throw new Error(
      error.message,
    );
  }

  if (!data) {
    throw new Error(
      'User not found',
    );
  }

  return {
    user: data,
  };
};

module.exports = {
  updateLanguage,
  updateName,
};