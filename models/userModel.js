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
  
  firstName: {
    type: String,
    required: [true, "Bitte den Vornamen eingeben"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false;
        if(value.length < 3) return false
        if (value.match(/[&\/\\#,+()$~%.'":*?<>{}]/g) || value.match(/^\d*(\.\d+)?$/)) return false
        else return true;
      },
      message:"Vorname min. 3 Buchstaben"
    },
    set: (value) => {
      return value.trim();
    },
  },

  lastName: {
    type: String,
    required: [true, "Bitte den Nachnamen eingeben"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false;
        if(value.length < 3) return false
        if (value.match(/[&\/\\#,+()$~%.'":*?<>{}]/g) || value.match(/^\d*(\.\d+)?$/)) return false
        else return true;
      },
      message:"Nachname min. 3 Buchstaben"
    },
    set: (value) => {
      return value.trim();
    },
  },

  email: {
    type: String,
    required: [true, "Bitte Ihre E-Mail eingeben"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false;
        if(!value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
          return false
        }
        else return true
      },
      message:"E-Mail Typ nicht korrekt"
    },
    set: (value) => {
      return value.trim();
    },
  },

  password: {
    type: String,
    required: [true, "Bitte Passwort eingben!"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false;
        if (value.length < 6 || value.length > 32) return false
        else return true;
      },
      message: "Passwortlänge zwischen 6 und 32 Buchstaben"
      },
      set: (value) => {
        return value.trim();
      },
  },

  street: {
    type: String,
    required: [true, "Die Straßen eingeben"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false
        if (value.match(/^\d*(\.\d+)?$/) || value.match(/[&\/\\#,+()$~%.'":*?<>{}]/g)) return false
        else return true;
      },
      message: "Feld darf nicht aus Sonderzeichen oder Zahlen bestehen",
    },
    set: (value) => {
      return value.trim();
    },
  },
  
  houseNumber: {
    type: Number,
    required: [true, "Hausnummer: Nur aus Nummern bestehend"],
    validate: {
      validator: (value) => {
        if(value === 0) return false
        else return true
      },
      message:"Bitte Hausnummer eingeben"
    }
  },

  zip: {
    type: Number,
    required: [true, "PLZ: Nur aus Nummern bestehend"],
    validate: {
      validator: (value) => {
        if(value === 0) return false
        else return true
      },
      message:"Bitte PLZ angeben"
    }
  },

  city: {
    type: String,
    required: [true, "Bitte Ihre Stadt eingeben"],
    validate: {
      validator: (value) => {
        if (value.trim().length === 0) return false
        if (value.match(/^\d*(\.\d+)?$/) || value.match(/[&\/\\#,+()$~%.'":*?<>{}]/g)) return false
        else return true;
      },
      message: "Feld darf nur aus Buchstaben bestehen",
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

  forgotPasswordToken: {
    type: String
  }
});

const userModel = model("User", userSchema);

module.exports = userModel;