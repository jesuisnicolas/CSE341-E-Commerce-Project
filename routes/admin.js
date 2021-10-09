const  express = require('express');
const path = require("path");
const rootDir = require("../util/path"); 
const router = express.Router();

//Controller's imports
const adminController = require("../controllers/admin");


// /admin/add-product => GET (this gets added in app.js)
router.get("/add-product", adminController.getAddProduct);


// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

// /admin/delete-product => POST
// router.post("/delete-product", adminController.postDeleteProduct);


// /admin/products => GET
router.get("/products", adminController.getAdminProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);


// when I want to import this elements I have to look for them in adminData.routes,
// and adminData.products
module.exports = router;


