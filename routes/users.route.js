

const express = require('express');
const router = express.Router();
const usersController = require("../controllers/user.controllers")
const verifyToken = require("../middlewares/verifyToken")
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(__dirname, '..', 'upload');
fs.mkdirSync(uploadDirectory, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });

// Register route with file upload handling
router.route('/register')
  .post(upload.single('avatar'), usersController.register);

// Login route
router.route('/login')
  .post(usersController.login);

// Get all users route
router.route('/')
  .get(verifyToken, usersController.getAllUsers);

module.exports = router;
