const express = require("express");
const { loginAdmin, signupAdmin, verifyAdminEmail, getAdminsProfile } = require("../controllers/adminUserController");
const withLoginAdmin = require("../middlewares/withLoginAdmin");
const router = express.Router();

// Login admin user
router.post("/sign-in", loginAdmin)

// Sign up admin user
router.post("/sign-up", signupAdmin)

// Verify E-Mail
router.post("/verify-admin-email", verifyAdminEmail)

// get the admin user
router.get("/admin-profile", withLoginAdmin, getAdminsProfile)

module.exports = router;