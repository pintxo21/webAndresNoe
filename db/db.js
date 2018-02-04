// Established database connection

var mongoose = require('mongoose');

var dbURI = 'mongodb://webAndresNoe:C@$trillo21@webandresnoe-shard-00-00-8qrb1.mongodb.net:27017,webandresnoe-shard-00-01-8qrb1.mongodb.net:27017,webandresnoe-shard-00-02-8qrb1.mongodb.net:27017/test?ssl=true&replicaSet=webAndresNoe-shard-0&authSource=admin';
mongoose.connect(dbURI);

// when connected with db
mongoose.connection.on('connected', function() {
    console.log('Connected to db ' + dbURI);
});

// some error when connecting
mongoose.connection.on('error', function(err) {
    console.log('Connection error: ' + err);
});

// disconnected from db
mongoose.connection.on('disconnected', function() {
    console.log('Disconnected from DB.');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Disconnected from DB by app.');
        process.exit(0);
    });
});

// bring in all models
require('./models/rsvp');