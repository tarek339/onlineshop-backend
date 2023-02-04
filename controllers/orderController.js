const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
const User = require("../models/userModel")
const Product = require("../models/productModel")
const nodemailer = require("nodemailer")
const { PDFDocument, StandardFonts } = require("pdf-lib");
const path = require("path")
const { writeFileSync, existsSync, mkdirSync } = require("fs");
// const { fs } = require("fs");

//Helper function for getting a valid message from mongoose
const mongooseErrorHandler = (error) => {
  if (error.errors) var errorMessage = Object.values(error.errors)[0].message;
  return errorMessage || error.message;
};

const getAllOrders = async (req, res, next) => {
    const orders = await Order.find({
        user: req.userId
    }).populate("items.product")
    res.json(orders)
};

const createOrder = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({
            user: req.userId
        })
        const user = await User.findById(req.userId) // find the user to send email and invoice wich is related to the user

        const order = new Order({
            totalPrice: cart.totalPrice,
            items: cart.items,
            user: req.userId,
            taxes: cart.taxes,
            nettoPrice: cart.nettoPrice
        })

        await order.save()
        cart.items = []
        cart.totalPrice = 0
        cart.nettoPrice = 0
        cart.taxes = 0
        await cart.save()

        order.items.forEach(async (item) => {
          const product = await Product.findById(item.product)
          product.quantity -= item.quantity
          await product.save()
        })

        // Create a new PDFDoc ument
        const pdfDoc = await PDFDocument.create()

        // Embed the Times Roman font
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        // Add a blank page to the document
        const page = pdfDoc.addPage()

        // Get the width and height of the page
        const { width, height } = page.getSize()

        // Draw a string of text toward the top of the page
        const fontSize = 30

        page.drawText(`total price: ${order.totalPrice.toFixed(2)} EUR`, {
          x: 50,
          y: height - 1 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          // color: rgb(0, 0.53, 0.71),
        })
        page.drawText(`total items: ${order.items.length}`, {
          x: 50,
          y: height - 2 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          // color: rgb(0, 0.53, 0.71),
        })

        const totalQuantity = order.items.reduce((sum, item) => {
          return (sum + item.quantity)
        }, 0)

        page.drawText(`total quantity: ${totalQuantity}`, {
          x: 50,
          y: height - 3 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          // color: rgb(0, 0.53, 0.71),
        })

        page.drawText(`Netto: ${order.nettoPrice.toFixed(2)} EUR`, {
          x: 50,
          y: height - 4 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          // color: rgb(0, 0.53, 0.71),
        })
        page.drawText(`Taxes: ${order.taxes.toFixed(2)} EUR`, {
          x: 50,
          y: height - 5 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          // color: rgb(0, 0.53, 0.71),
        })
        page.drawText(`Order ID: ${order._id}`, {
          x: 50,
          y: height - 6 * fontSize,
          size: fontSize,
          font: timesRomanFont,
          // color: rgb(0, 0.53, 0.71),
        })

        
        const newOrder = await Order.findById(order._id).populate("items.product")
        newOrder.items.forEach((item, index) => {
          page.drawText(`product name: ${item.product.name} quantity: ${item.quantity}`, {
            x: 50,
            y: height - (7 + index) * fontSize,
            size: fontSize,
            font: timesRomanFont,
            // color: rgb(0, 0.53, 0.71),
          })
        })

        // create folder if not exists
        const createDirIfNotExists = dir =>
        !existsSync(dir) ? mkdirSync(dir) : undefined
        createDirIfNotExists(`${user.firstName}_orders`)

        writeFileSync(`${user.firstName}_orders/${user.firstName}_${user.lastName}_${order._id}.pdf`, await pdfDoc.save())
       
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
            subject: `Your order from ${new Date().toLocaleString("de-DE")} order ID: ${order._id}`,
            html:`<p>orders for ${user.firstName} ${user.lastName}</p>
            `,
            attachments: [{
                filename: "invoice.pdf",
                path: path.join(__dirname,`../${user.firstName}_orders/${user.firstName}_${user.lastName}_${order._id}.pdf`)
            }]
          })
        res.json(order)
    }

    catch (err) {
      console.log(err)
      res.status(422).json({
        message: mongooseErrorHandler(err)
      })
    }
}

module.exports = {
    createOrder,
    getAllOrders,
}