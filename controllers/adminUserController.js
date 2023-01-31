const AdminUser = require("../models/adminUserModel")
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const mongooseErrorHandler = (error) => {
    if (error.errors) var errorMessage = Object.values(error.errors)[0].message;
    return errorMessage || error.message;
  };

  const signupAdmin = async (req, res, next) => {
    try {
    const emailExist = await AdminUser.findOne({ email: req.body.email }); // search for existing email
    // Validating the email
    if (emailExist) {
      return res.status(422).json({ // res status of 422 is an error status, by default its 200
        message: "Email already exist!",
      });
    }
    // create an email token for verification
    const emailToken = crypto.randomBytes(32).toString("hex")
  
    const adminUser = new AdminUser({
      email: req.body.email, 
      password: req.body.password, 
      emailVerificationToken: emailToken
    });
  
    await adminUser.save(); // after signing in save methode to save the object in the database
    
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tarekjassine@gmail.com",
        pass: "wonoytjxbqgxhjtm"
      }
    })
    await transport.sendMail({
      from: "tarekjassine@gmail.com",
      to: adminUser.email,
      subject: "Verify your E-Mail",
      html:`<p>Verify your E-Mail to use the App</p>
            <a href="http://localhost:3001/verify-email?token=${emailToken}">click here to verify</a>      
      `
    })
  
    // Creating a token:
    // 1- We can store something in the token
    // 2- We need a secret/password
    // Each token needs:
    // 1. Some data
    // 2. Secret
    // 3. Expiry Date
    const token = jwt.sign(
      {
        adminUserId: adminUser._id,
      },
        "secret123456", // need it for verification
      {
        expiresIn: "7d",
      }
    );
  
    // sending data to the browser
    res.json({
      adminUser: {
        _id: adminUser._id,
        email: adminUser.email,
        emailVerified: adminUser.emailVerified
      },
      token,
    });
  }
    catch (error) {
      res.status(422).json({
        message: mongooseErrorHandler(error)
      })
    }
  };

// Log in -line start-
const loginAdmin = async (req, res, next) => {
    try{
    // find the AdminUser and check if email and password belong to the AdminUser
    const adminUser = await AdminUser.findOne({ 
      email: req.body.email,
      password: req.body.password,
    });
  
    if (req.body.email.length === 0) {
      return res.status(422).json({
        message: "Please provide your email"
      })
    }
  
    if (req.body.password.length === 0) {
      return res.status(422).json({
        message: "Please provide your password"
      })
    }
  
    if (!adminUser) { // the condition for wrong singning in details. 
      return res.status(422).json({
        message: "Wrong email or wrong password!",
      });
    }
    
  // Creating a token:
  // 1- We can store "something" in the token
  // 2- We need a secret/password
  // Each token needs:
  // 1. "Some" data
  // 2. Secret
  // 3. Expiry Date
  const token = jwt.sign(
    {
      adminUserId: adminUser._id, // to identify wich user is loged in
    },
      "secret123456", // need it for verification
    {
      expiresIn: "7d",
    }
  );

  res.json({
    adminUser: {
      _id: adminUser._id,
      email: adminUser.email,
      emailVerified: adminUser.emailVerified
    },
    token,
  });
  }
    catch(error) {
      res.status(422).json({
        message: mongooseErrorHandler(error)
      })
    }
  };

    // Verify email
const verifyAdminEmail = async (req, res, next) => {
  try {
    const adminUser = await AdminUser.findOne({
      emailVerificationToken: req.body.token
    })
    if(!adminUser) {
      return res.status(422).json({
        message: "Invalid token!"
      }) 
    }
    adminUser.emailVerified = true
    await adminUser.save()
    res.json(adminUser)
  }

  catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error)
    })
  }
}

  // Get Profile
const getAdminsProfile = async (req, res, next) => {
  try {
  const adminUser = await AdminUser.findById(req.adminUserId).select("-password") // find the user id wich is stored in the token but ofcourse not the password
  res.json(adminUser)
  
  }
  catch(error) {
    res.status(401).json({
      message: "Please log in!"
    }
    )
  }
}

  module.exports = {
    loginAdmin,
    signupAdmin,
    verifyAdminEmail,
    getAdminsProfile
  };