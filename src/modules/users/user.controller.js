const userService = require('./user.service');

const updateLanguage = async (req, res) => {
  try {
    /**
     * Validate body
     */
    const { preferred_language } = req.body;

    if (!preferred_language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required',
      });
    }

    /**
     * Validate auth user
     */
    if (!req.user?.user_id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    /**
     * Update user
     */
    const result = await userService.updateLanguage({
      userId: req.user.user_id,
      preferred_language,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log('updateLanguage error:', err.message);

    console.log(err);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

const updateName = async (req, res) => {
  try {
    /**
     * Validate auth
     */
    if (!req.user?.user_id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    /**
     * Validate body
     */
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    /**
     * Clean value
     */
    const cleanName =
      name.trim();

    /**
     * Min validation
     */
    if (cleanName.length < 3) {
      return res.status(400).json({
        success: false,
        message:
          'Name must be minimum 3 characters',
      });
    }

    /**
     * Max validation
     */
    if (cleanName.length > 32) {
      return res.status(400).json({
        success: false,
        message:
          'Name is too long',
      });
    }

    /**
     * Update
     */
    const result =
      await userService.updateName({
        userId:
          req.user.user_id,

        name: cleanName,
      });

    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(
      'updateName error:',
      err,
    );

    return res.status(500).json({
      success: false,
      message:
        'Something went wrong',
    });
  }
};

module.exports = {
  updateLanguage,
  updateName,
};