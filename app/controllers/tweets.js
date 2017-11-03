"use strict";
const Tweet = require("../models/tweet");
const User = require("../models/user");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(user => {
        return Tweet.find({})
          .populate("user")
          .then(tweets => {
            let myTweets = [];
            for (let i = 0; i < tweets.length; i++) {
              let tweet = tweets[i];
              if (tweet.user.id === user.id) {
                myTweets.push(tweet);
              }
            }
            return [tweets.reverse(), myTweets.reverse(), user];
          })
          .then(results => {
            return User.find({}).then(userlist => {
              return [results[0], results[1], results[2], userlist];
            });
          });
      })
      .then(result => {
        reply.view("home", {
          title: "Home",
          tweets: result[0],
          myTweets: result[1],
          user: result[2],
          userlist: result[3]
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};

exports.tweet = {
  handler: function(request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    const tweet = new Tweet(request.payload);

    User.findOne({ email: userEmail })
      .then(user => {
        tweet.user = user._id;
        return tweet.save();
      })
      .then(newTweet => {
        reply.redirect("/home");
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.viewUser = {
  handler: function(request, reply) {
    let paramEmail = request.params.email;

    if (paramEmail !== request.auth.credentials.loggedInUser) {
      User.findOne({ email: paramEmail })
        .then(user => {
          return Tweet.find({})
            .populate("user")
            .then(tweets => {
              let userTweets = [];
              for (let i = 0; i < tweets.length; i++) {
                let tweet = tweets[i];
                if (tweet.user.id === user.id) {
                  userTweets.push(tweet);
                }
              }
              return [userTweets.reverse(), user];
            })
            .then(results => {
              return User.find({}).then(userlist => {
                return [results[0], results[1], userlist];
              });
            });
        })
        .then(result => {
          reply.view("viewuser", {
            title: result[1].firstName + "'s Profile",
            tweets: result[0],
            user: result[1],
            userlist: result[2]
          });
        })
        .catch(err => {
          Logger.info(err);
          reply.redirect("/");
        });
    } else {
      reply.redirect("/home");
    }
  }
};

exports.deleteAllTweets = {
  handler: function(request, reply) {
    let userEmail = request.params.email;

    User.findOne({ email: userEmail })
      .then(user => {
        Logger.info(user.id);
        Tweet.remove({ user: user.id }).then(result => {
          reply.redirect("/home");
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};
