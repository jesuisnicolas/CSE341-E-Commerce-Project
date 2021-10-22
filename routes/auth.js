const  express = require('express');
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user"); 

const authController = require("../controllers/auth");
 

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get("/reset", authController.getReset);  

router.get("/reset/:token", authController.getNewPassword);


/***************
 * POST ROUTES *
 ***************/

router.post('/login', 
  check(
    [
      body("email")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),
      body("password")
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ]
), authController.postLogin);

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'The password must be alphanumerical and at least 5 characters long'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
  ], authController.postSignup);

router.post('/logout', check(), authController.postLogout);

router.post("/reset", check(), authController.postReset);

router.post("/new-password", authController.postNewPassword);

module.exports = router;

