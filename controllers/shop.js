const Product = require("../models/product");
const Order = require("../models/order");

// This GET returns the page with the products
exports.getProducts = (req, res, next) => {
  /* Calling the static methos without having to instantiate the class.
  Here I have to use a callback function to retrieve the data 
  because the fetchAll methos is asynchronous (using JSON) */
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: "/product",
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
}

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
}

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      })
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": req.user._id})
    .then(orders => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
    })    
  });
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(user => {
      const products = user.cart.items.map(i => {
        return {quantity: i.quantity, product: {...i.productId._doc}};
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.isLoggedIn
  });
}