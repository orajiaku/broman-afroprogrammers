var express = require('express');
var api = express.Router();
var SlackBot = require('slackbots');
var path = require('path');

var Users = require(path.resolve() + '/models/users');


// create a bot
var bot = new SlackBot({
    token: 'xoxb-176384464513-5rDFSyXP7NPgqDu6NFHBWkIu', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'Bro Man'
});

api.post('/slack/everyone', function(req, res, next) {


    Users.find({}, function (err, users) {
        if(err){
            console.log(err);
            res.json({});
        }else{
            res.json({
                attachments: [
                    {
                        icon_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2017-03-31/163706802022_759cbc799ce3053c0c14_96.png',
                        text: 'LOVE IT',
                        image_url: 'http://www.planwallpaper.com/static/images/9-credit-1.jpg'
                    }
                ]
            });
        }
    });
});

api.post('/users', function (req, res, next) {
   Users.create(req.body, function (err, user) {
       if(err){
           res.json(err);
       }else{
           res.json(user);
       }
   });
});

module.exports = api;
