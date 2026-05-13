const db = require('../../config/db');

const updateCompanionGender =
    async ({
        userId,
        genderPreference,
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
         * Validate gender preference
         */
        if (
            !genderPreference
        ) {
            throw new Error(
                'Gender preference is required',
            );
        }

        /**
         * Allowed values
         */
        const allowedPreferences =
            [
                'male',
                'female',
                'non_binary',
            ];

        /**
         * Prevent invalid value
         */
        if (
            !allowedPreferences.includes(
                genderPreference,
            )
        ) {
            throw new Error(
                'Invalid gender preference',
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
            .update({
                gender_preference:
                    genderPreference,

                /**
                 * Move onboarding
                 */
                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                'user_id',
                userId,
            )
            .select()
            .single();

        /**
         * Profile DB error
         */
        if (profileError) {
            throw new Error(
                profileError.message,
            );
        }

        /**
         * Missing profile
         */
        if (!profileData) {
            throw new Error(
                'Onboarding profile not found',
            );
        }

        /**
         * Update onboarding step
         */
        const {
            data: userData,
            error: userError,
        } = await db
            .from('users')
            .update({
                onboarding_step:
                    'role',
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

const updateCompanionRole =
    async ({
        userId,
        companionRole,
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
         * Validate role
         */
        if (
            !companionRole
        ) {
            throw new Error(
                'Companion role is required',
            );
        }

        /**
         * Allowed roles
         */
        const allowedRoles =
            [
                'special',
                'friend',
                'caring',
                'romantic',
                'listener',
                'fun',
                'naughty',
                'unique',
            ];

        /**
         * Prevent invalid role
         */
        if (
            !allowedRoles.includes(
                companionRole,
            )
        ) {
            throw new Error(
                'Invalid companion role',
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
            .update({
                companion_role:
                    companionRole,

                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                'user_id',
                userId,
            )
            .select()
            .single();

        /**
         * Profile DB error
         */
        if (profileError) {
            throw new Error(
                profileError.message,
            );
        }

        /**
         * Missing profile
         */
        if (!profileData) {
            throw new Error(
                'Onboarding profile not found',
            );
        }

        /**
         * Move onboarding step
         */
        const {
            data: userData,
            error: userError,
        } = await db
            .from('users')
            .update({
                onboarding_step:
                    'intent',
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

module.exports = {
    updateCompanionGender,
    updateCompanionRole
};