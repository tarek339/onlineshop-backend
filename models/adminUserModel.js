// name - String
// email - String
// password - String
// age - Number
// Schema = Structure

// Install mongodb compass for viewing for databases
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toLocaleTimeString("de-DE", {
        year:"numeric", 
        month:"2-digit", 
        day:"2-digit", 
        hour: "2-digit", 
        minute:"2-digit"
    })
  },
  
  email: {
    type: String,
    required: [true, "Please provide your E-Mail"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false;
        if(!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
          return false
        }
        else return true
      },
      message:"Incorrect type of E-Mail"
    },
    set: (value) => {
      return value.trim();
    },
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false;
        if (value.length < 6 || value.length > 32) return false
        else return true;
      },
      message: "Password's length shall be between 6 and 32 characters"
      },
      set: (value) => {
        return value.trim();
      },
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },
  
  emailVerificationToken: {
    type: String,
  },
});

const adminUser = model("Admin-User", userSchema);

module.exports = adminUser;