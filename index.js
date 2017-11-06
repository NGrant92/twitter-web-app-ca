'use strict';

//making hapi accessable in this file
const Hapi = require('hapi');

//creating new hapi server
let server = new Hapi.Server();

const fs = require('fs');
var options = {
  port: 4443,     //  or any port you wish
  tls: {
    key: fs.readFileSync('app/private/webserver.key'),
    cert: fs.readFileSync('app/private/webserver.crt')
  }
};

//setting the server connection to localhost:4000
server.connection(options);

require('./app/models/db');

//server.bind({
//currentUser: {},
//users: [],
//donations: [],
//});

server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

  if (err) {
    throw err;
  }

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',
  });

  server.auth.default({
    strategy: 'standard',
  });

  //setting server route to routes.js
  server.route(require('./routes'));
  server.route(require('./routesapi'));

  //making server accessible it'll throw an error there is one
  server.start(err => {
    if (err) {
      throw err;
    }

    //console message
    console.log('server listening at: ', server.info.uri);
  });
});
