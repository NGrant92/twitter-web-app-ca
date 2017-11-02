"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Candidate = require("../models/user");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(user => {
        return Tweet.find({})
          .populate("user")
          .then(tweets => {
            return [tweets, user];
          })
          .then(results => {
            return User.find({}).then(userlist => {
              return [results[0], results[1], userlist];
            });
          });
      })
      .then(result => {
        reply.view("home", {
          title: "Post a Tweet",
          tweets: result[0],
          user: result[1],
          userlist: result[2]
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};

exports.tweet = {
  validate: {
    payload: {
      tweetText: Joi.string().required()
    },

    failAction: function(request, reply, source, error) {
      User.findOne({ email: request.auth.credentials.loggedInUser })
        .then(user => {
          return Tweet.find({})
            .populate("user")
            .then(tweets => {
              return [tweets, user];
            })
            .then(results => {
              return User.find({}).then(userlist => {
                return [results[0], results[1], userlist];
              });
            });
        })
        .then(result => {
          reply.view("home", {
            title: "Post a Tweet",
            tweets: result[0],
            user: result[1],
            userlist: result[2],
            errors: error.data.details
          });
        })
        .catch(err => {
          Logger.info(err);
          reply.redirect("/");
        });
    }
  }
};
