const ErrorResponse = require("../utils/errorResponse");
const rolesConfig = require("../config/roles.json");

/**
 * Middleware to check if user has required permission
 * @param {string} permission - The permission required for the route
 */
exports.checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorResponse("Not authorized to access this route", 401));
        }

        const userRole = (req.user.role || "admin").toLowerCase();
        const roleData = rolesConfig.roles.find((r) => r.name === userRole);

        if (!roleData) {
            return next(new ErrorResponse("Role not found", 403));
        }

        if (!roleData.permissions.includes(permission)) {
            return next(
                new ErrorResponse(
                    `Permission denied. Role '${userRole}' does not have '${permission}' permission.`,
                    403
                )
            );
        }

        next();
    };
};
