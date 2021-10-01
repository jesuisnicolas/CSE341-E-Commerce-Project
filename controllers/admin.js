const Product = require("../models/product");

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
    null,
    req.body.title,
    req.body.author,
    req.body.price, 
    req.body.description,
    req.body.imgUrl
  );
  product.save(); 
  res.redirect('/');
};

// This will GET the product page
exports.getEditProduct = (req, res, next)=> {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
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
  const updatedProduct = new Product(prodId, updatedTitle, updatedAuthor, updatedPrice,  updatedDescription, updatedImg);
  updatedProduct.save();
  res.redirect('/admin/products');
};

// This GET returns the page with the ADMIN products.
exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products => {
    res.render('admin/products', {prods: products, 
                        pageTitle: 'Admin Product',
                        path: '/admin/products' 
                        }
    ); 
  }));
}