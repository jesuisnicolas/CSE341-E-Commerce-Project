const  express = require('express');

const path = require("path");

const rootDir = require("../util/path"); 

const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res, next)=> {
  const products = adminData.products;
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', 
    {prods: products, 
              pageTitle: 'Shop', 
              path: '/', 
              hasProducts: products.length > 0,
              activeShop: true,
              productCSS: true
            }); //pug file
});

module.exports = router;


