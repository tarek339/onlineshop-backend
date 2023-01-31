const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteSingleProduct,
  deleteAllProducts,
  editProduct,
} = require("../controllers/productControllers");

const router = express.Router();

// Create a product
router.post("/", createProduct);

// Get all the products
router.get("/", getAllProducts);

// Get a single product
router.get("/:id", getSingleProduct);

// Delete a single product
router.delete("/:id", deleteSingleProduct);

// Delete all products
router.delete("/", deleteAllProducts);

// Edit all products
router.put("/:id", editProduct);

module.exports = router;
