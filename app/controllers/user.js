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
        reply.view("home", {
          title: "Home",
          tweets: result[0],
          user: result[1],
          myTweets: result[2],
          userlist: result[3]
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};

exports.viewUser = {
  handler: function(request, reply) {
    let paramEmail = request.params.email;

    if (paramEmail !== request.auth.credentials.loggedInUser) {
      User.findOne({ email: paramEmail })
        .then(foundUser => {
          return Tweet.find({ user: foundUser })
            .populate("user")
            .then(userTweets => {
              return [userTweets.reverse(), foundUser];
            })
            .then(results => {
              return User.find({ admin: false }).then(userlist => {
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

exports.deleteAllTweets = {
  handler: function(request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;

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

exports.deleteTweetSet = {
  handler: function(request, reply) {
    let tweetSet = Object.keys(request.payload);

    for (let i = 0; i < tweetSet.length; i++) {
      Tweet.remove({ _id: tweetSet[i] })
        .then(result => {
          console.log("Tweet Removed: " + tweetSet[i]);
        })
        .catch(err => {
          console.log(err);
        });
    }
    reply.redirect("/home");
  }
};
