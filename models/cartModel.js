const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
    nettoPrice: {
        type: Number,
        default: 0,
    },
    taxes: {
        type: Number,
        default: 0,
    },
    totalPrice:{
        type: Number,
        default: 0,
    },
    
    items: [{ // Connect to the product id and put a refrence to the model
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
const cartModel = model("Cart", cartSchema);
module.exports = cartModel;