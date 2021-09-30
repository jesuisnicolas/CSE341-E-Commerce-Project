const Product = require("../models/product");

// This will GET the product page
exports.getAddProduct = (req, res, next)=> {
  res.render('admin/add-product', {
    pageTitle: 'Add Product', 
    path: '/admin/add-product', 
    formsCSS: true, 
    productCSS: true, 
    activeAddProduct: true
  });
};

// This is the POST to Add a Product
exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.author,
    req.body.price, 
    req.body.summary,
    req.body.imageUrl
  );
  product.save(); 
  res.redirect('/');
};

// This GET returns the page with the ADMIN products.
exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll((products => {
    res.render('admin/products', {prods: products, 
                        pageTitle: 'Admin Product',
                        path: '/admin/products', 
                        hasProducts: products.length > 0,
                        activeShop: true,
                        productCSS: true}
    ); 
  }));
}