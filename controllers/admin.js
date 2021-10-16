const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
// This will GET the product page
exports.getAddProduct = (req, res, next)=> {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product', 
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

// This is the POST to Add a Product
exports.postAddProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    imgUrl: req.body.imgUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log("Product Created");
      res.redirect("/products");
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
      isAuthenticated: req.session.isLoggedIn
    });
  });
  
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedAuthor = req.body.author;
  const updatedImg = req.body.imgUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then(p => {
      p.title = updatedTitle;
      p.author = updatedAuthor;
      p.imgUrl = updatedImg;
      p.price = updatedPrice;
      p.description = updatedDescription;
      return p.save();
    })
    .then(result => {
      console.log("Updated product");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.error(err);
    })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(result => {
      console.log("Product Deleted");
      res.redirect('/admin/products');
    })
};

// This GET returns the page with the ADMIN products.
exports.getAdminProducts = (req, res, next) => {
  Product.find()
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
      console.log(err);
    });
}

