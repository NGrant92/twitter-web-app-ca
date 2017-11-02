"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Candidate = require("../models/user");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {

    let userList = User.find({});

    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(user => {
        Tweet.find({})
          .populate("user")
          .then(tweets => {
            reply.view("home", {
              title: "Post a Tweet",
              tweets: tweets,
              user: user
            });
          });
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};
