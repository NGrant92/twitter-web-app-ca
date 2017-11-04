const Accounts = require("./app/controllers/accounts");
const Tweets = require("./app/controllers/tweets");
const Assets = require("./app/controllers/assets");

module.exports = [
  { method: "GET", path: "/", config: Accounts.main },
  { method: "POST", path: "/register", config: Accounts.userRegister },
  { method: "GET", path: "/signup", config: Accounts.signup },
  { method: "GET", path: "/login", config: Accounts.login },
  { method: "POST", path: "/login", config: Accounts.authenticate },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/settings", config: Accounts.viewSettings },
  { method: "POST", path: "/settings/update", config: Accounts.updateSettings },

  { method: "GET", path: "/home", config: Tweets.home },
  { method: "GET", path: "/viewuser/{email}", config: Tweets.viewUser },
  { method: "POST", path: "/home/tweet", config: Tweets.tweet },
  { method: "GET", path: "/tweets/deleteall", config: Tweets.deleteAllTweets },
  { method: "POST", path: "/tweets/deletetweetset", config: Tweets.deleteTweetSet },

  {
    method: "GET",
    path: "/{param*}",
    config: { auth: false },
    handler: Assets.servePublicDirectory
  }
];
