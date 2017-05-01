/**
 * Created by orajiakuchukwudalu on 2016-03-19.
 */

var mongoose = require('mongoose');
var Promise = require('bluebird');

if(!process.env.DB_URL){
    process.env.DB_URL = 'mongodb://localhost/broman';
}

Promise.promisifyAll(mongoose);

var mongodbURL = process.env.DB_URL;
var mongodbOptions = { };

/*
 //configuration for single connection
 //connection linked to mongoose, e.g. for model use "mongoose.model('User', User);"
 mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
 if (err) {
 console.log('Connection refused to ' + mongodbURL);
 console.log(err);
 } else {
 console.log('Connection successful to: ' + mongodbURL);
 }
 });
 */

//configuration for multiple connections
var connection = mongoose.createConnection(mongodbURL, mongodbOptions, function(err){
    if (err) {
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});

module.exports = connection;