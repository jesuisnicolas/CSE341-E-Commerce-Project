const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { validationResult } = require("express-validator");

// This will GET the product page
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};
// This will GET the product page
exports.getEditProduct = (req, res, next)=> {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
    if(!product) {
      return res.redirect("/");
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product', 
      path: '/admin/edit-product', 
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
      isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
  
};
// This GET returns the page with the ADMIN products.
exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id") //this is a SELECT for the query
    // .populate("userId") //this will retrieve all the information (JOIN)
    .then(products => {
      res.render('admin/products', 
      { prods: products, 
        pageTitle: 'Admin Products', 
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn 
      }); 
    })
    .catch(err => {
      const error = new Error("Error retrieving the data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
}


/**************
* POST ROUTES *
***************/

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        author: author,
        imgUrl: imgUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title: title,
    author: author,
    price: price,
    description: description,
    imgUrl: imgUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error("Adding this product failed.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedAuthor = req.body.author;
  const updatedImg = req.body.imgUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        author: updatedAuthor,
        imgUrl: updatedImg,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(p => {
      if(p.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      p.title = updatedTitle;
      p.author = updatedAuthor;
      p.imgUrl = updatedImg;
      p.price = updatedPrice;
      p.description = updatedDescription;
      return p.save()
        .then(result => {
          console.log("Updated product");
          res.redirect("/admin/products");
        })
    })
    .catch(err => {
      const error = new Error("Editing this product failed.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(result => {
      console.log("Product Deleted");
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error("Deleting this product failed.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    })
};



