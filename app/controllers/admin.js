"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(foundUser => {
        return Tweet.find({})
          .populate("user")
          .then(tweets => {
            return [tweets.reverse(), foundUser];
          })
          .then(result => {
            return Tweet.find({ user: result[1] })
              .populate("user")
              .then(myTweets => {
                return [result[0], result[1], myTweets.reverse()];
              });
          })
          .then(result => {
            return User.find({ admin: false }).then(userlist => {
              return [result[0], result[1], result[2], userlist];
            });
          });
      })
      .then(result => {
        reply.view("homeadmin", {
          title: "Admin Home",
          tweets: result[0],
          user: result[1],
          userlist: result[3]
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};

exports.remUser = {
  handler: function(request, reply) {
    console.log(request.params.email);
    let userEmail = request.params.email;

    User.find({ email: userEmail })
      .then(foundUser => {
        Tweet.remove({ user: foundUser }).then(result => {
          console.log("Removed tweets of user");
        });
        return foundUser;
      })
      .then(foundUser => {
        User.findOneAndRemove(foundUser).then(result => {
          console.log("Removed user");
        });
      })
      .then(result => {
        reply.redirect("/home");
      })
      .catch(err => {
        console.log(err);
        reply.redirect("/");
      });
  }
};

exports.addUser = {
  handler: function(request, reply) {
    console.log(request.body);
    reply.redirect("/home");
  }
};
