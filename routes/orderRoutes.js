const express = require("express");
const { createOrder, getAllOrders} = require("../controllers/orderController");
const withLogin = require("../middlewares/withLogin");

const router = express.Router();

router.get("/", withLogin, getAllOrders)
router.post("/", withLogin, createOrder)


module.exports = router