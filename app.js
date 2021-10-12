const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

// importing models
const User = require("./models/user");

//importing the routes
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes =require("./routes/auth");

MONGODB_URI = "mongodb+srv://nicoscha:B9qFzXihHAoU6Rzz@cluster0.j1eeq.mongodb.net/shop";

const app = express(); //all the logic of express is in this variable
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});


app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public"))); //this allows us to access the static files


/* this is the session middleware. It will automatically create
a cookie for the session */
app.use(
  session({ 
    secret: "my secret", 
    resave: false, 
    saveUninitialized: false,
    store: store
   })
);

app.use((req, res, next) => {
  if(!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err)
    });     
})


//This will use the middlewares inside the files in the routes folder,
//this is cool because this file doesn't get that crowded.
app.use("/admin", adminRoutes); //the first parameter is the location in the URL
app.use(shopRoutes);
app.use(authRoutes);


//404 page | As I'm using app.use everything gets here if there's no match before
app.use("", errorController.get404);


// mongoConnect(() => {
//   //This listen function will create the http server, and listen for incoming connections)
//   app.listen(PORT, () => console.log(`Listening on ${PORT}`));
// });


mongoose.connect(MONGODB_URI)
  .then(result => {
    User.findOne().then(user => {
      if(!user) {
        const user = new User({
          username: "Nicolas",
          email: "nicolas@email.com",
          cart: {items: [] }
        })
        user.save();
      }
    })
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  });