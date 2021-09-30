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
  constructor(title, author, price, summary, img) {
    this.title = title;
    this.author = author;
    this.price = price;
    this.summary = summary;
    this.imgUrl = img;
  }

  save() {
    getProductFromFile(products => {
      products.push(this); 
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }
  /* the static keyword makes sure I can call this method from
  the class itself, without having to instantiate the object.
  I'm using a callback here because this is asynchronous code.
  If I don't have a callback, I will get an error. */
  static fetchAll(cb) {
    getProductFromFile(cb);
  //   const p = path.join(path.dirname(require.main.filename),
  //    "data", 
  //    "products.json");

  //   fs.readFile(p, (err, fileContent) => {
  //     if(err) {
  //       // return [];
  //       cb([]);
  //     }
  //     // return JSON.parse(fileContent);
  //     cb(JSON.parse(fileContent));
  //   });
  }   
}