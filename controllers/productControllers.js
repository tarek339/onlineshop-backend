const Product = require("../models/productModel");
const mongooseErrorHandler = (error) => {
  if (error.errors) var errorMessage = Object.values(error.errors)[0].message;
  return errorMessage || error.message;
};

// Create product
const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.body.image,
    });

    await product.save();
    res.json({
      product: {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image: product.image
      }
    });

  } catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error)
    })
  }
};

// Get all product
const getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  res.json(products);
}; 

// Get single product
const getSingleProduct = async (req, res, next) => {
try {
  const product = await Product.findById(req.params.id);
  res.json(product);

} catch (error) {
  res.status(422).json({
    message: mongooseErrorHandler(error)
  })
}
};

// Delete single product
const deleteSingleProduct = async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  const products = await Product.find();
  res.json({
    message: "Produkt wurde gelöscht!",
    products,
  });
};

// Delete all products
const deleteAllProducts = async (req, res, next) => {
  await Product.deleteMany();
  const products = await Product.find();
  res.json({
    message: "Alle Produkte wurden gelöscht!",
    products,
  });
 };

// Edit product 
const editProduct = async (req, res, next) => {
  try{
    const product = await Product.findById(req.params.id)
  
    product.name = req.body.name
    product.description = req.body.description
    product.quantity = req.body.quantity
    product.image = req.body.image
    product.price = req.body.price

    await product.save()
    res.json(product)
  }
  catch (error) {
    res.status(422).json({
      message: mongooseErrorHandler(error)
    })
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteSingleProduct,
  deleteAllProducts,
  editProduct
};
