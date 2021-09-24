const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");



//importing the routes
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const PORT = process.env.PORT || 5000; // So we can run on heroku || (OR) localhost:5000

const app = express(); //all the logic of express is in this variable

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public"))); //this allows us to access the static files

//This will use the middlewares inside the files in the routes folder,
//this is cool because this file doesn't get that crowded.
app.use("/admin", adminData.routes); //the first parameter is the location in the URL
app.use(shopRoutes);

//404 page | As I'm using app.use everything gets here if there's no match before
app.use((req, res, next) => {
  res.status(404).render("404", { 
    pageTitle: "Page Not Found", 
    path: "",
  });
})


//This listen function will create the http server, and listen for incoming connections)
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
