"use strict";
const User = require("../models/user");
const Joi = require("joi");
const Logger = require("../utils/logger");

exports.main = {
  auth: false,
  handler: function(request, reply) {
    reply.view("main", { title: "Welcome to Twitter" });
  }
};

exports.signup = {
  auth: false,
  handler: function(request, reply) {
    reply.view("signup", { title: "Sign up for Twitter" });
  }
};

exports.login = {
  auth: false,
  handler: function(request, reply) {
    reply.view("login", { title: "Login to Twitter" });
  }
};

exports.logout = {
  auth: false,
  handler: function(request, reply) {
    request.cookieAuth.clear();
    reply.redirect("/");
  }
};

exports.authenticate = {
  auth: false,

  validate: {
    payload: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    },

    options: {
      abortEarly: false
    },

    failAction: function(request, reply, source, error) {
      reply
        .view("login", {
          title: "Sign in error",
          errors: error.data.details
        })
        .code(400);
    }
  },

  handler: function(request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email })
      .then(foundUser => {
        if (foundUser && foundUser.password === user.password) {
          request.cookieAuth.set({
            loggedIn: true,
            loggedInUser: user.email
          });
          reply.redirect("/home");
        } else {
          reply.redirect("/signup");
        }
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.userRegister = {
  auth: false,

  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    },

    options: {
      abortEarly: false
    },

    failAction: function(request, reply, source, error) {
      reply
        .view("signup", {
          title: "Signup error",
          errors: error.data.details
        })
        .code(400);
    }
  },

  handler: function(request, reply) {
    const user = new User(request.payload);
    user.img = "http://res.cloudinary.com/ngrant/image/upload/v1509624963/Profile_iet7qx.png";
    user.admin = false;
    user.save()
      .then(newUser => {
        reply.redirect("/login");
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.viewSettings = {
  handler: function(request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail })
      .then(foundUser => {
        reply.view("settings", {
          title: "Edit Account Settings",
          user: foundUser
        });
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.updateSettings = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    },

    options: {
      abortEarly: false
    },

    failAction: function(request, reply, source, error) {
      reply
        .view("signup", {
          title: "Update error",
          errors: error.data.details
        })
        .code(400);
    }
  },

  handler: function(request, reply) {
    const newUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail })
      .then(user => {
        user.firstName = newUser.firstName;
        user.lastName = newUser.lastName;
        user.email = newUser.email;
        user.password = newUser.password;
        return user.save();
      })
      .then(user => {
        reply.redirect("/home");
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.isAdmin = {
  handler: function(request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(user => {
        if (user.admin) {
          reply.redirect("/home/admin");
        } else {
          reply.redirect("/home/user");
        }
      })
      .catch(err => {
        console.log(err);
        reply.redirect("/");
      });
  }
};
