const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/appError");
const User = require("../models/user.models");
const httpStatusText = require("../utils/httpStatusTest");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
 
    const users = await User.find({}, {"__v": false, password: false  }).limit(limit).skip(skip);
    res.json({status : httpStatusText.Success , data : {users}});
});

const register = asyncWrapper(async (req, res, next) => {
    const { firstName,lastName, email, password, role } = req.body;
    const avatar = req.file ? `uploads/${req.file.filename}` : undefined;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(AppError.create("Email already exists", 400, httpStatusText.Fail));
    }

    // hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 12);
    // Here you would typically save the user to the database
   const newUser = new User({ firstName, lastName, email, password: hashedPassword, role, avatar:req.file ? `uploads/${req.file.filename}` : undefined });

   //genete a token for the user
    newUser.token = await generateJWT({ email: newUser.email, userId: newUser._id, role: newUser.role });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { firstName, lastName, email, role: newUser.role, avatar: newUser.avatar }, token: newUser.token });
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(AppError.create("Email and password are required", 400, httpStatusText.Fail));
     }

    const user = await User.findOne({ email });
    if (!user) {
        return next(AppError.create("Invalid email or password", 401, httpStatusText.Fail));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(AppError.create("Invalid email or password", 401, httpStatusText.Fail));
    }   

    // Here you would typically verify the user's credentials
    const token = await generateJWT({ email: user.email, userId: user._id, role: user.role });
    res.status(200).json({ message: 'Login successful', data: {token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } } });
});

module.exports = {
    getAllUsers,
    register,
    login
};
