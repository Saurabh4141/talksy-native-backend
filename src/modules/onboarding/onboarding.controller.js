const onboardingService = require('./onboarding.service');

/**
 * Update companion gender
 */
const updateCompanionGender = async (req, res) => {
    try {
        /**
         * Validate body
         */
        const {
            gender_preference,
        } = req.body;

        if (
            !gender_preference
        ) {
            return res.status(400).json({
                success: false,

                message:
                    'Gender preference is required',
            });
        }

        /**
         * Update onboarding profile
         */
        const result =
            await onboardingService.updateCompanionGender(
                {
                    userId:
                        req.user.user_id,

                    genderPreference:
                        gender_preference,
                },
            );

        return res.json({
            success: true,

            data: result,
        });
    } catch (err) {
        console.log(
            'updateCompanionGender error:',
            err,
        );

        return res.status(500).json({
            success: false,

            message:
                err.message ||
                'Something went wrong',
        });
    }
};


/**
* Update companion role
*/
const updateCompanionRole = async (req, res) => {
    try {
        /**
         * Validate body
         */
        const {
            companion_role,
        } = req.body;

        if (
            !companion_role
        ) {
            return res.status(400).json({
                success: false,

                message:
                    'Companion role is required',
            });
        }

        /**
         * Update onboarding profile
         */
        const result =
            await onboardingService.updateCompanionRole(
                {
                    userId:
                        req.user.user_id,

                    companionRole:
                        companion_role,
                },
            );

        return res.json({
            success: true,

            data: result,
        });
    } catch (err) {
        console.log(
            'updateCompanionRole error:',
            err,
        );

        return res.status(500).json({
            success: false,

            message:
                err.message ||
                'Something went wrong',
        });
    }
};


module.exports = {
    updateCompanionGender,
    updateCompanionRole,
};