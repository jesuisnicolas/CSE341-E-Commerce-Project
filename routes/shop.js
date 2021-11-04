const  express = require('express');
const path = require("path");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");


router.get("/", shopController.getIndex);
 
router.get("/products", shopController.getProducts);

// GET route to extract the ID of the product and show the Details
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.get("/checkout", isAuth, shopController.getCheckout);

router.post("/cart", isAuth,  shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// router.get("/checkout", shopController.getCheckout);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);




module.exports = router;


