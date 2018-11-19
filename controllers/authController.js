const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: "You are now logged in! 👍"
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 👋');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); //continue because they are logged in.
  }
  req.flash('error', 'Oops, you must be logged in to do that!');
  res.redirect('/login');
}

exports.forgot = async (req, res) => {
  // see if user exists with email
  //use req.body so they can change the info themselves
  const user = await User.findOne({ email: req.body.email});
  if (!user) {
    req.flash('error', 'An email has been sent to the email address provided.')
    return res.redirect('/login');
  }

  // set reset tokens and expiration
  // Uses crypto, which is built in to Node.js
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpiry = Date.now() + 3600000; // 1 hr in ms
  await user.save(); //save the user to db
  // send email
  const resetURL = `http://${req.headers.host}.account/reset/${user.resetPasswordToken}`;
  req.flash('success', `A temporary password has been emailed to your account ${resetURL}`)
  // redirect to login
  res.redirect('/login');
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpiry: { $gt: Date.now() } // looks for a expire time in the db that greater than the current time (therefore a later time)
  });

  if (!user) {
    req.flash('error', "Oops, you sneaky person! (Token invalid or expired)");
    res.redirect('/login');
  }
  res.render('reset', { title: 'Reset your password!'} );
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next(); //keep going
    return;
  }
  req.flash('error', 'Password must match!');
  res.redirect('back');
}

exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpiry: { $gt: Date.now() } // looks for a expire time in the db that greater than the current time (therefore a later time)
  });

  if (!user) {
    req.flash('error', "Oops, you sneaky person! (Token invalid or expired)");
    res.redirect('/login');
  }

  const setPassword = promisify(user.setPassword, user)
  await setPassword(req.body.password); //uses the setPassword (now as a promise) to reset;
  user.resetPasswordToken = undefined; //removed reset stuff
  user.resetPasswordExpiry = undefined;
  const updatedUser = await user.save(); //saves updated user
  await req.login(updatedUser) //.login is a passport method
  req.flash('success', 'Your password has been reset! 👍 ');
  res.redirect('/');
}