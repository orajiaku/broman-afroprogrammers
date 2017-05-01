var express = require('express');
var api = express.Router();
var SlackBot = require('slackbots');
var path = require('path');

var Users = require(path.resolve() + '/models/users');


// create a bot
var bot = new SlackBot({
    token: 'xoxp-121321798400-122115649573-176273915184-b709cbdc6debffbda82426a5bd5c1412', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'Bro Man'
});

api.post('/slack/everyone', function(req, res, next) {
    /*req.body['user_name'],
        req.body['text'].substring(1,req.body['text'].length - 1 ),
        req.body['channel_name'],
        req.body['response_url']*/

    Users.find({}, function (err, users) {
        if(err){
            console.log(err);
            res.json({});
        }else{
            res.json({
                image: "",
                name:"Dalu "
            });
        }
    });

    var result = [];



    res.json();
});

module.exports = api;
