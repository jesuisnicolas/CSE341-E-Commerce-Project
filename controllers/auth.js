const User = require('../models/user');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");

const crypto = require("crypto"); 

const transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

exports.getLogin = (req, res, next) => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message
});
}



/***************
 * POST ROUTES *
 **************/
 

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
    .then(userDoc => {
      if(userDoc) {
        req.flash("error", "E-mail already taken.");
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          cart: {items: [] }
        });
        return user.save();
      })
      .then(result => {
        res.redirect("/login");
        return transporter.sendMail({
          to: email,
          from: "nfrancisco89@hotmail.com",
          subject: "Welcome to E-commerce project",
          html: "<h1>You succesfully signed up!</h1>"
        })
        .then(result =>{
          console.log("Mail Sent");
        })
        .catch(err => {
          console.log(err);
        });
      });
    })
     
    .catch(err => {
      console.log(err)
    });
};

exports.postLogin = (req, res, next) => {
  /* this session object is created by the session manager, and isLoggedIn is created as a 
  ** cookie automatically by the package. */
 const email = req.body.email;
 const password = req.body.password;
 User.findOne({email: email})
  .then(user => {
     if(!user) {
       req.flash("error", "Invalid email or password");
       return res.redirect("/login");
     } 
     bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => { //this function is to ensure we saved the data in the db before redirecting
            console.log(err);
            res.redirect("/");    
        })}
          req.flash("error", "Invalid email or password");
          res.redirect("/login"); 
      });
})
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(error);
      return res.redirect("/reset");
    }
    const token = buffer.toString('hex');

    //Find the user and store the token in the db
    User.findOne({email: req.body.email})
      .then(user => {
        if(!user) {
          req.flash("error", "No account with that email address exists.")
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.tokenExpiration = Date.now() + 3600000;
        return user.save();
        })
        .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "nfrancisco89@hotmail.com",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset</p>
            <p>Clik this <a href:"/http://localhost:5000/reset/${token}">link</a> to reset your password:</p>

          `
      })
      .catch(err => {
        console.log(err);
      });
  });
})};
