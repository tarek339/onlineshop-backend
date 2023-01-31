const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const adminUserRoutes = require("./routes/userAdminRoutes")
const stripe = require("stripe")("sk_test_51LxuKOLC3UmUHQtd7nkE8uqqIw7qC1v8km1VH7HFjQwPuHbspLDEtRKCJfFEJvKo57GU5DS5kWwQ0Gvqzdxopm9d00qTKrXk7q")

const app = express();
app.use(cors())
app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes)
app.use("/admin-user", adminUserRoutes)

app.post("/payment-intent", async (req, res) => {

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "EUR"
    })
    res.json(paymentIntent.client_secret)
  } catch (error) {
    res.status(500).json({message:"Network error"})
  }
})

mongoose.connect("mongodb+srv://tarek:Sony2020@cluster0.ywzi97j.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`server is running on http://localhost:${port} on ${new Date().toLocaleString("de-DE")}`);
  });
});