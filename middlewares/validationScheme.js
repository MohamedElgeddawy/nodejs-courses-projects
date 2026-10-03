
const { body } = require('express-validator');

const validationScheme = () => {
    return [
        body('title')
            .notEmpty()
            .withMessage("title is require"),
        body('price')
            .notEmpty()
            .withMessage("price is require")
    ];
};

module.exports = validationScheme;