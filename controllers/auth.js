const User = require('../models/user');
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");

const crypto = require("crypto"); 

const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

/**************
 * GET ROUTES *
 **************/

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
        errorMessage: message,
        oldInput: {  email: "", password: "" },
        validationErrors: []
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
    errorMessage: message,
    oldInput: { name: "", email: "", password: "" },
    validationErrors: []
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

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
};


/***************
 * POST ROUTES *
 ***************/
 

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { name: name, email: email, password: password },
      validationErrors: errors.array()
    }); //this will render the same page
  }
    bcrypt.hash(password, 12)
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
          from: "jesuisnicolas@protonmail.com",
          subject: "Welcome to E-commerce project",
          html: "<h1>You succesfully signed up!</h1>"
        })
        .then(result =>{
          console.log("Mail Sent");
        })
        .catch(err => {
          console.log(err);
        });
      })     
      .catch(err => {
        const error = new Error("Error retrieving data.");
        error.httpStatusCode = 500;
        return next(error); //this will let express know that is has to use the error middleware
      });
};

exports.postLogin = (req, res, next) => {
  /* this session object is created by the session manager, and isLoggedIn is created as a 
  ** cookie automatically by the package. */
 const email = req.body.email;
 const password = req.body.password;

 const errors = validationResult(req);
  if(!errors.isEmpty()) { 
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      oldInput: { email: email, password: password },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

 User.findOne({email: email})
  .then(user => {
     if(!user) {
       return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        oldInput: { email: email, password: password },
        errorMessage: "Invalid email or password",
        validationErrors: []
      });
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
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          oldInput: { email: email, password: password }, 
          errorMessage: "Invalid email or password",
          validationErrors: []
        }); 
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
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
        })
        .then(result => {
          res.redirect("/");
          transporter.sendMail({
            to: req.body.email,
            from: "jesuisnicolas@protonmail.com",
            subject: "Password Reset",
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="https://cse341-nscha.herokuapp.com/reset/${token}">link</a> to set a new password.</p>
            `
          })     
        })
        .catch(err => {
          console.log(err);
        });
})};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error("Error retrieving data.");
      error.httpStatusCode = 500;
      return next(error); //this will let express know that is has to use the error middleware
    });
};
