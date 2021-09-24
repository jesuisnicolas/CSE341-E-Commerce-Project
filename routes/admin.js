const  express = require('express');
const path = require("path");
const rootDir = require("../util/path"); 
const router = express.Router();

const products = [];

// /admin/add-product => GET (this gets added in app.js)
router.get("/add-product", (req, res, next)=> {
  res.render('add-product', {
    pageTitle: 'Add Product', 
    path: '/admin/add-product', 
    formsCSS: true, 
    productCSS: true, 
    activeAddProduct: true});
});


// /admin/add-product => POST
router.post("/add-product", (req, res, next)=> {
  products.push({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price, 
    summary: req.body.summary,
    imageUrl: req.body.imageUrl
  });
  res.redirect('/');
})

// /admin/delete-product => POST
router.post("/delete-product", (req, res, next) => {
  //this line modifies the original array. USE WITH CAUTION
  products.splice(req.body.productIndex, 1);
  res.redirect("/");
})

// when I want to import this elements I have to look for them in adminData.routes,
// and adminData.products
exports.routes = router;
exports.products = products;

