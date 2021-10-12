const User = require('../models/user');

exports.getLogin = (req, res, next) => {
      res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true");

  /* this session object is created by the session manager, and isLoggedIn is created as a 
  ** cookie automatically by the package. */
 User.findById("61611dde86f074315481bf00")
 .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => { //this function is to ensure we saved the data in the db before redirecting
          console.log(err);
          res.redirect("/");
        });
      })
      .catch(err => {
        console.log(err)
      });     
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

