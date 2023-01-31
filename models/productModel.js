const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  createdAt: {
    type: String,
    default: new Date().toLocaleTimeString(
      "de-DE",
      {
        year:"numeric", 
        month:"2-digit", 
        day:"2-digit", 
        hour: "2-digit", 
        minute:"2-digit"
    })
  },
  
  name: {
    type: String,
    required: [true, "Please provide the product name!"],
    validate: {
      validator: (value) => { // validating empty strings
        if (value.trim().length === 0) return false;
        // if (value.match(/[&\/\\#,+()$~%.'":*?<>{}]/g) || value.match(/^\d*(\.\d+)?$/)) return false
        else return true;
      },
      message: "Enter a valid product name",
      },
      set: (value) => {
        return value.trim();
      },
  },

  description: {
    type: String,
    required: [true, "Please provide the description!"],
    validate: {
      validator: (value) => { // validating empty strings
        if (value.trim().length === 0) return false;
        // if (value.match(/[&\/\\#,+()$~%.'":*?<>{}]/g) || value.match(/^\d*(\.\d+)?$/)) return false
        else return true;
      },
      message: "Enter a valid description",
    },
    set: (value) => {
      return value.trim();
    },
  },

  quantity: {
    type: Number,
    required: [true, "Please provide the quantity!"],
    validate: {
      validator: (value) => {
        if (value < 1) return false;
        else return true;
      },
      message: "Quantity should be greater than 0",
    },
  },

  image: {
    type: String,
    required: [true, "Please provide the image!"],
  },

  price: {
    type: Number,
    required: [true, "Please provide the price"],
    validate: {
      validator: (value) => {
        if (value < 1) return false;
        else return true;
      },
      message: "Price should be greater than 0",
    },
  },
});

const productModel = model("Product", productSchema);

module.exports = productModel;