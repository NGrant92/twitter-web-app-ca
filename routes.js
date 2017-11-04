const Accounts = require("./app/controllers/accounts");
const User = require("./app/controllers/user");
const Admin = require("./app/controllers/admin");
const Assets = require("./app/controllers/assets");

module.exports = [
  { method: "GET", path: "/", config: Accounts.main },
  { method: "POST", path: "/register/{admin}", config: Accounts.userRegister },
  { method: "GET", path: "/signup", config: Accounts.signup },
  { method: "GET", path: "/login", config: Accounts.login },
  { method: "POST", path: "/login", config: Accounts.authenticate },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/settings", config: Accounts.viewSettings },
  { method: "POST", path: "/settings/update", config: Accounts.updateSettings },

  { method: "GET", path: "/home/admin", config: Admin.home },
  { method: "GET", path: "/admin/remuser/{email}", config: Admin.remUser },

  { method: "GET", path: "/home/user", config: User.home },
  { method: "GET", path: "/viewuser/{email}/{admin}", config: User.viewUser },
  { method: "POST", path: "/home/tweet", config: User.tweet },
  { method: "GET", path: "/tweets/deleteall", config: User.deleteAllTweets },
  { method: "POST", path: "/tweets/deletetweetset", config: User.deleteTweetSet },


  { method: "GET", path: "/home", config: Accounts.isAdmin },

  {
    method: "GET",
    path: "/{param*}",
    config: { auth: false },
    handler: Assets.servePublicDirectory
  }
];
