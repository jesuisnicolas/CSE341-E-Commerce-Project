/*
* The Idea here is using the mongoConnect function to connect at 
* the launch of the server. This will create a db connection in the
* _db variable, so each time we need to get something from or to 
* the database we use the same _db object instead of connecting 
* multiple times per session.
*/

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// this will be only used internally in this file, thus the _
let _db;

const mongoConnect = (cb) => {
  MongoClient.connect("mongodb+srv://nicoscha:B9qFzXihHAoU6Rzz@cluster0.j1eeq.mongodb.net/CSE341?retryWrites=true&w=majority")
  .then(result => {
    console.log("Connected to mongodb");
    _db = result.db("shop");
    cb(result);
  })
  .catch(err => {
    console.log("Error connecting to mongodb");
    throw err;
  });
};

const getDb = () => {
  if(_db) {
    return _db;
  } else {
    throw "No Database Found";
  }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;