/*
This file creates a Product class that represents a single product.
*/
const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb ;
// const cart = require('./cart');


module.exports = class Product {
  constructor(title, author, price, description, img, id) {
    this.title = title;
    this.author = author;
    this.price = price;
    this.description = description;
    this.imgUrl = img;
    this._id = id ? new mongoDb.ObjectId(id) : null;
  }

  save(){
    const db = getDb();
    let dbOp;
    if(this._id) {
      //Update the product
      dbOp = db.collection("products").updateOne({_id: this._id}, {$set: this});
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
  }

  static deleteById(prodId) {
    return getDb().collection("products").deleteOne({_id: new mongoDb.ObjectId(prodId)});
     
}
  /* the static keyword makes sure I can call this method from
  the class itself, without having to instantiate the object.
  I'm using a callback here because this is asynchronous code.
  If I don't have a callback, I will get an error. */
  static fetchAll(cb) {
    const db = getDb();
    return db.collection("products")
      .find() //find returns a cursor
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection("products")
     .find({_id: new mongoDb.ObjectId(prodId)})
     .next()
     .then(product => {
       return product;
     })
     .catch(err => {
       console.log(err);
     });
  }


};