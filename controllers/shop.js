const Product = require("../models/product");
const Cart = require("../models/cart");

// This GET returns the page with the products
exports.getProducts = (req, res, next)=> {
  /* Calling the static methos without having to instantiate the class.
  Here I have to use a callback function to retrieve the data 
  because the fetchAll methos is asynchronous (using JSON) */
  Product.fetchAll((products => {
    res.render('shop/product-list', {prods: products, 
                        pageTitle: 'Shop', 
                        path: '/products' 
    }); 
  })); 
};

exports.getProduct = (req, res, next)=> {
  const prodId = req.params.productId;

  Product.findById(prodId, product => {
    res.render('shop/product-detail', { product: product,
                                        pageTitle: product.title,
                                        path: "/product"}); 
  });
}

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

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
  
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {pageTitle: "Your Orders",
                          path: "/orders"}
  );
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {pageTitle: "Checkout",
                          path: "/checkout"}
  );
}