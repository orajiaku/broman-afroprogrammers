var express = require('express');
var api = express.Router();
var SlackBot = require('slackbots');
var path = require('path');

var Users = require(path.resolve() + '/models/users');

if(process.env.slackToken){
    console.log("Token Provided");
}

if(process.env.slackBotName){
    console.log("slack bot name provided")
}

// create a bot
var bot = new SlackBot({
    token: process.env.slackToken, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: process.env.slackBotName
});

api.post('/slack/everyone', function(req, res, next) {

    var result = [];
    Users.find({}, function (err, users) {
        if(err){
            console.log(err);
            res.json({});
        }else{
            if(users){
                users.map(function (user) {
                    var toSend = "*Current job:* "+ user.current_job + "\n" +
                        "*LinkedIn:* "+ user.linkedInUrl + "\n" +
                        "*City:* "+user.city + "\n" +
                        "*Country:* "+ user.country + "\n" +
                        "*Website:* " + user.website_url + "\n"+
                        "*Projects:* \n";

                    for (var i = 0; i < user.projects.length; i++){
                        const proj = user.projects[i];
                        toSend += "\n";
                        toSend += "\t";
                        toSend += "*Name :* " + proj.name + "\n";
                        toSend += "\t";
                        toSend += "*Description :* " + proj.description + "\n";
                        toSend += "\t";
                        toSend += "*Repo :* " + proj.repository_url + "\n";
                        toSend += "\n";
                    }

                    toSend += "*Interests:* " + user.interests.join(' , ') + "\n";

                    result.push({
                        image_url: user.profilePictureUrl ? user.profilePictureUrl : "https://s3-us-west-2.amazonaws.com/afro-programmers/bro_icom.png",
                        pretext: "*"+user.name+"*",
                        text: toSend,
                        mrkdwn_in: ["text", "pretext"]
                    });
                    return user;
                });
                res.json({
                    attachments: result
                });
            }else{
                res.json({text: "Database currently empty"})
            }
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

api.post('/channel', function (req, res, next) {
    var params = {
        //icon_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2017-05-01/176279838560_adc5324a264f4965325f_96.png'
    };
    bot.postMessageToChannel(req.body.channel, req.body.message, params);
    res.json({success: "true"});
});

module.exports = api;
