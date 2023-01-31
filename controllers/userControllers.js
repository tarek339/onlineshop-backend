const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const Cart = require("../models/cartModel")
//Helper function for getting a valid message from mongoose
const mongooseErrorHandler = (error) => {
  if (error.errors) var errorMessage = Object.values(error.errors)[0].message;
  return errorMessage || error.message;
};

// Create single user
const createUser = async (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();

  res.json({msg:"User has been created"}, user);
};

// Get all users
const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.json(users);
};

// Get single user
const getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  res.json(user);
}

// Delete single user
const deleteSingleUser = async (req, res, next) => {
 await User.findByIdAndDelete(req.params.id);
 const users = await User.find();
  res.json({
    message: "User has been deleted!",
    users,
  });
};

// Delete all user
const deleteAllUser = async (req, res, next) => {
 await User.deleteMany();
 const users = await User.find();
  res.json({
    message: "All users has been deleted!",
    users,
  });
};

// Edit user
const editProfile = async (req, res, next) => {
  try{
    const user = await User.findById(req.userId) // find the user id wich is stored in the token

    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.street = req.body.street
    user.houseNumber = req.body.houseNumber
    user.city = req.body.city
    user.zip = req.body.zip

    await user.save()
    res.json(user)
  }
  catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err)
    })
  }
}

//Verify Password
const verifyPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)

    if(user.password != req.body.password) {
      return res.status(422).json({
        message:"password incorrect!"
      })
    }
    res.json({message:"password verified"})
  } 
  
  catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err)
    })
  }
}

// Verify Email
const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.body.token
    })
    if(!user) {
      return res.status(422).json({
        message: "Invalid token!"
      }) 
    }
    user.emailVerified = true
    await user.save()
    res.json(user)
  }

  catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err)
    })
  }
}

//Edit E-Mail
const editEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    const emailExist = await User.findOne({ // check if email is available
      email: req.body.email
    })

    if(emailExist) {
      return res.status(422).json({
        message:"E-mail existiert bereits!"
      })
    }
    user.email = req.body.email
    user.emailVerified = false
    // create an email token for verification
    const token = crypto.randomBytes(32).toString("hex")
    user.emailVerificationToken = token
    await user.save()

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tarekjassine@gmail.com",
        pass: "wonoytjxbqgxhjtm"
      }
    })
    await transport.sendMail({
      from: "tarekjassine@gmail.com",
      to: user.email,
      subject: "Verify your email",
      html:`<p>Verify your email</p>
            <a href="http://localhost:3000/verify-email?token=${token}">click here to verify</a>      
      `
    })

    res.json(user) //to send the updated user datas
  } 
  catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err)
    })
  }
}

//1. recieve email from the frontend
//2. find the  user with that email
//3.create a token
//4.store the token in the database
//5.send an email via nodemailer
//6.include a link that user can open to change a password

const sendForgotPasswordEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email})
    if(!user) {
      return res.status(422).json({
        message:"Benutzer existiert nicht!"
      })
    }
    // create an email token for verification
    const token = crypto.randomBytes(32).toString("hex")
    user.forgotPasswordToken = token

    await user.save()
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tarekjassine@gmail.com",
        pass: "wonoytjxbqgxhjtm"
      }
    })
    await transport.sendMail({
      from: "tarekjassine@gmail.com",
      to: user.email,
      subject: "Change the password",
      html:`<p>Change the password</p>
            <a href="http://localhost:3000/forgot-password?token=${token}">click here to change password</a>      
      `
    })
    res.json({
      message: "Bitte überprüfen Sie Ihre Mail"
    })
  } 
  catch (err) {
    res.status(422).json({
      message: err.message
    })
  }
}

// Forgot Password
//1. Recieve the token and the password from the frontend
//2. Find the user with that token
//3. Change the password of the user
const forgotpassword = async (req, res, next) => {
  try {
    const user = await User.findOne({forgotPasswordToken: req.body.token})
    if(!user) {
      return res.status(422).json({
        message:"Incorrect token!"
      })
    }
    user.password = req.body.password
    await user.save()
    res.json({
      message:"Ihr Password wurde geändert"
    })
  } 
  catch (err) {
    res.status(422).json({
      message: err.message
    })
  }
}

//Sign up -line start-
const signup = async (req, res, next) => {
  try {
  const emailExist = await User.findOne({ email: req.body.email }); // search for existing email
  // Validating the email
  if (emailExist) {
    return res.status(422).json({ // res status of 422 is an error status, by default its 200
      message: "E-Mail existiert bereits!",
    });
  }
  // create an email token for verification
  const emailToken = crypto.randomBytes(32).toString("hex")

  const user = new User({
    firstName: req.body.firstName,  // the required object the user should have to sign up
    lastName: req.body.lastName, 
    email: req.body.email, 
    password: req.body.password, 
    street: req.body.street, 
    houseNumber: req.body.houseNumber, 
    zip: req.body.zip, 
    city: req.body.city,
    emailVerificationToken: emailToken
  });

  await user.save(); // after signing in save methode to save the object in the database
  const cart = new Cart({
    user: user._id 
  })
  await cart.save();
  
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tarekjassine@gmail.com",
      pass: "wonoytjxbqgxhjtm"
    }
  })
  await transport.sendMail({
    from: "tarekjassine@gmail.com",
    to: user.email,
    subject: "Verify your E-Mail",
    html:`<p>Verify your E-Mail to use the App</p>
          <a href="http://localhost:3000/verify-email?token=${emailToken}">click here to verify</a>      
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
      userId: user._id,
    },
      "secret123", // need it for verification
    {
      expiresIn: "7d",
    }
  );

  // sending data to the browser
  res.json({
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      street: user.street,
      houseNumber: user.houseNumber,
      zip: user.zip,
      city: user.city,
      emailVerified: user.emailVerified
    },
    token,
  });
}
  catch (err) {
    res.status(422).json({
      message: mongooseErrorHandler(err)
    })
  }
};
// -line end-

// Log in -line start-
const login = async (req, res, next) => {
  try{
  // find the user and check if email and password belong to the user
  const user = await User.findOne({ 
    email: req.body.email,
    password: req.body.password,
  });

  if (req.body.email.length === 0) {
    return res.status(422).json({
      message: "E-mail eingeben"
    })
  }

  if (req.body.password.length === 0) {
    return res.status(422).json({
      message: "Passwort eingeben"
    })
  }

  if (!user) { // the condition for wrong singning in details. 
    return res.status(422).json({
      message: "Falsche E-Mail oder falsches Passwort!",
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
      userId: user._id, // to identify wich user is loged in
    },
      "secret123", // need it for verification
    {
      expiresIn: "7d",
    }
  );

  res.json({
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      street: user.street,
      houseNumber: user.houseNumber,
      zip: user.zip,
      city: user.city,
      emailVerified: user.emailVerified
    },
    token,
  });
}
  catch(err) {
    res.status(422).json({
      message: mongooseErrorHandler(err)
    })
  }
};
// -line end-

// Get Profile
const getProfile = async (req, res, next) => {
  try {
  const user = await User.findById(req.userId).select("-password") // find the user id wich is stored in the token but ofcourse not the password
  res.json(user)
  }
  catch(err) {
    res.status(401).json({
      message: "Please log in!"
    }
    )
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getSingleUser,
  deleteSingleUser,
  deleteAllUser,
  signup,
  login,
  getProfile,
  editProfile,
  verifyPassword,
  editEmail,
  verifyEmail,
  sendForgotPasswordEmail,
  forgotpassword
};