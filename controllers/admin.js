const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
// This will GET the product page
exports.getAddProduct = (req, res, next)=> {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product', 
    path: '/admin/add-product',
    editing: false
  });
};

// This is the POST to Add a Product
exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.author,
    req.body.price, 
    req.body.description,
    req.body.imgUrl
  );
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
      product: product
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

   const updatedProduct = new Product( updatedTitle, updatedAuthor, updatedPrice,  updatedDescription, updatedImg, prodId);
  updatedProduct.save().then(result => {console.log("Product updated")}).catch(err => {console.log(err)});
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};

// This GET returns the page with the ADMIN products.
exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', 
      { prods: products, 
        pageTitle: 'Admin Products', 
        path: '/admin/products' 
      }); 
    })
    .catch(err => {
      console.log(err);
    });
}

