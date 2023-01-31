const express = require("express");
const { getAllUsers, 
        createUser, 
        getSingleUser, 
        deleteSingleUser, 
        signup, 
        login, 
        getProfile, 
        deleteAllUser,
        editProfile,
        verifyPassword,
        editEmail,
        verifyEmail,
        sendForgotPasswordEmail,
        forgotpassword,
         } = require("../controllers/userControllers");
const withLogin = require("../middlewares/withLogin");

const router = express.Router();

// Creating a user
router.post("/", createUser);

// SignUp a user
router.post("/signup", signup)

// SignIn a user
router.post("/signin", login)

// Getting all users
router.get("/", getAllUsers);

// Edit Profile
router.put("/", withLogin, editProfile)

// Verify Password
router.post("/verify-password", withLogin, verifyPassword)

// Verify E-Mail
router.post("/verify-email", verifyEmail)

// Edit E-Mail
router.put("/edit-email", withLogin, editEmail)

// send forgot password email
router.post("/forgot-password-email", sendForgotPasswordEmail)

// change the password
router.put("/forgot-password", forgotpassword)

// Check userpage
router.get("/profile", withLogin, getProfile)

// Get single user
router.get("/:id", getSingleUser);

// Delete user
router.delete("/:id", deleteSingleUser)

// Delete all user
router.delete("/", deleteAllUser)

module.exports = router;