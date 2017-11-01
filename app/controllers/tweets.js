"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Candidate = require("../models/user");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    Tweet.find({})
      .then(tweets => {
        reply.view("home", {
          title: "Post a Tweet",
          tweets: tweets
        });
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};
