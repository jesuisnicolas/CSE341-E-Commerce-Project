/*
This file creates a Product class that represents a single product.
*/
const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename),
     "data", 
     "products.json");

const getProductFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
      if(err) {
        // return [];
        return cb([]);
      }
      // return JSON.parse(fileContent);
      cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
  constructor(id, title, author, price, description, img) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.description = description;
    this.imgUrl = img;
  }

  save(){
    getProductFromFile(products => {
        if (this.id) {
            const existingProductIndex = products.findIndex(prod => prod.id === this.id);
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = this;
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) =>{
                console.log(err);
            });
        } else {
            this.id = Math.random().toString(); //this creates a dummy unique ID for each product
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) =>{
            console.log(err);
        });
        }
        
    });
}
  /* the static keyword makes sure I can call this method from
  the class itself, without having to instantiate the object.
  I'm using a callback here because this is asynchronous code.
  If I don't have a callback, I will get an error. */
  static fetchAll(cb) {
    getProductFromFile(cb);
  }   

  static findById(id, cb) {
    getProductFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};