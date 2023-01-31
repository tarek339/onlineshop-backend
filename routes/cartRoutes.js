const express = require("express");
const { addItem, decrementItem, removeItem, clearCart, getCart } = require("../controllers/cartController");
const withLogin = require("../middlewares/withLogin");

const router = express.Router();

router.post("/item", withLogin, addItem )
router.post("/item/decrement", withLogin, decrementItem)
router.post("/item/delete", withLogin, removeItem)
router.delete("/clear-cart", withLogin, clearCart)
router.get("/", withLogin, getCart)

module.exports = router