const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
//Helper function for getting a valid message from mongoose
const mongooseErrorHandler = (error) => {
  if (error.errors) var errorMessage = Object.values(error.errors)[0].message;
  return errorMessage || error.message;
};

const addItem = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId
        })

        const product = await Product.findById(req.body.productId)

        const itemIndex = cart.items.findIndex((item)=> {
            if(item.product._id == req.body.productId) {
                return true
            } 
        })

        if(itemIndex == -1) {
            cart.items.push({
                product: req.body.productId,
            })
        }

        else if (cart.items[itemIndex].quantity >= product.quantity) {
        }

        else  {
            cart.items[itemIndex].quantity ++
            
        }

        cart.totalPrice += product.price
        cart.totalPrice = cart.totalPrice.toFixed(2)
        cart.nettoPrice = cart.totalPrice / 119 * 100
        cart.nettoPrice = cart.nettoPrice.toFixed(2)
        cart.taxes = cart.totalPrice / 119 * 19
        cart.taxes = cart.taxes.toFixed(2)
        await cart.save()

        const newCart = await Cart.findOne({
            user: req.userId
        }).populate("items.product") // populate to get the actuall product

        res.json(newCart)
    }
    catch (err) {
        res.status(422).json({
            message: mongooseErrorHandler(err)
          })
    }
}

const decrementItem = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId
        })

        const product = await Product.findById(req.body.productId)

        console.log(req.body.productId)
        const itemIndex = cart.items.findIndex((item)=> {
            if(item.product._id == req.body.productId) {
                return true
            } 
        })
        console.log(itemIndex)
        if(cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity --
            cart.totalPrice -= product.price
            cart.totalPrice = cart.totalPrice.toFixed(2)
            cart.nettoPrice = cart.totalPrice / 119 * 100
            cart.nettoPrice = cart.nettoPrice.toFixed(2)
            cart.taxes = cart.totalPrice / 119 * 19
            cart.taxes = cart.taxes.toFixed(2)
        }

        await cart.save()
        const newCart = await Cart.findOne({
            user: req.userId
        }).populate("items.product")
        res.json(newCart)
    }
    catch (err) {
        res.status(422).json({
            message: mongooseErrorHandler(err)
          })
    }
}

const removeItem = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId
        })

        const product = await Product.findById(req.body.productId)

        const itemIndex = cart.items.findIndex((item)=> {
            if(item.product._id == req.body.productId) {
                return true
            } 
        })
        // this multiply line the product price with the quantity then dec the price
        cart.totalPrice -= product.price * cart.items[itemIndex].quantity
        cart.totalPrice = cart.totalPrice.toFixed(2)
        cart.nettoPrice = cart.totalPrice / 119 * 100
        cart.nettoPrice = cart.nettoPrice.toFixed(2)
        cart.taxes = cart.totalPrice / 119 * 19
        cart.taxes = cart.taxes.toFixed(2)

        cart.items = cart.items.filter((item, index) => {
            if(itemIndex !== index) {
                return true
            }
        })
        console.log(itemIndex)

        await cart.save()
        const newCart = await Cart.findOne({
            user: req.userId
        }).populate("items.product")
        res.json(newCart)
    }
    catch (err) {
        res.status(422).json({
            message: mongooseErrorHandler(err)
          })
    }
}

const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId
        })
        cart.items = [] // set it back to initiall state
        cart.nettoPrice = 0
        cart.taxes = 0
        cart.totalPrice = 0 // set it back to initiall value
        cart.quantity = 0
        await cart.save()
        const newCart = await Cart.findOne({
            user: req.userId
        }).populate("items.product")
        res.json(newCart)
    }
    catch (err) {
        res.status(422).json({
            message: mongooseErrorHandler(err)
          })
    }
}

const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId
        }).populate("items.product") // populate methode is giving out all properties

        res.json(cart)
    }
    catch (err) {
        res.status(422).json({
            message: mongooseErrorHandler(err)
          })
    }
}

module.exports = {
    addItem,
    decrementItem,
    removeItem,
    clearCart,
    getCart
}