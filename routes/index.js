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
                        //console.log(proj);
                        toSend += "\n";
                        toSend += "\t";
                        toSend += "*Name :* " + proj.name + "\n";
                        toSend += "\t";
                        toSend += "*Description :* " + proj.description + "\n";
                        toSend += "\t";
                        toSend += "*Repo :* " + proj.repository_url + "\n";
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

module.exports = api;
