const Product = require("../models/product");

// This GET returns the page with the products
exports.getProducts = (req, res, next)=> {
  /* Calling the static methos without having to instantiate the class.
  Here I have to use a callback function to retrieve the data 
  because the fetchAll methos is asynchronous (using JSON) */
  Product.fetchAll((products => {
    res.render('shop/product-list', {prods: products, 
                        pageTitle: 'Shop', 
                        path: '/products', 
                        hasProducts: products.length > 0,
                        activeShop: true,
                        productCSS: true}
    ); 
  })); 
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products => {
    res.render('shop/index', {prods: products, 
                        pageTitle: 'Shop', 
                        path: '/', 
                        }
    ); 
  }));
}

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {pageTitle: "Cart",
                          path: "/cart"}
  );
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {pageTitle: "Checkout",
                          path: "/checkout"}
  );
}