const jwt = require('jsonwebtoken');
const httpStatusText = require("../utils/httpStatusTest")
const appError = require("../utils/appError")
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = verifyToken;
