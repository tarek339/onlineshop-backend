const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
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

    totalPrice: {
        type: Number
    },
    
    nettoPrice: {
        type: Number
    },

    taxes : {
        type: Number
    },

    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],

    quantity:{
        type: Number
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const orderModel = model("Order", orderSchema);
module.exports = orderModel;