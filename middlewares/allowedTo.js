AppError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusTest");

const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(AppError.create("You are not logged in", 401, httpStatusText.Fail));
        }

        if (!roles.includes(req.user.role)) {
            return next(AppError.create("You are not allowed to perform this action", 403, httpStatusText.Fail));
        }

        next();
    };
};

module.exports = allowedTo;
