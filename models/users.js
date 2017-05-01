/**
 * Created by orajiakuchukwudalu on 2017-03-15.
 */


var db = require('../config/mongodb');
var immutablePlugin = require('mongoose-immutable');

var Promise = require('bluebird');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var bcrypt = require('bcrypt-nodejs');

var SALT_WORK_FACTOR = 10;

/*
 TODO: Remove store following.
 TODO: Confirm all property counts are incremented and decremented
 */
var userSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        default: require('shortid').generate,
        index: true,
        immutable: true
    },
    //Core information
    name:{type: String},
    username: {type: String, lowercase: true, index: true},
    middleNames:[String],
    current_location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {type: [Number], default: [0,0]}
    },
    email:{type: String, index: true, unique: true
    },
    password: {type: String},
    profilePictureUrl: {type: String},
    country: {type: String},
    projects: [{
        name: {
            type: String
        },
        description: {
            type: String
        },
        repository_url: {
            type: String
        },
        website_url: {
            type: String
        }
    }],
    website_url: {
        type: String
    },
    linkedInUrl: {type: String},
    skills: [String],
    current_job: {type: String},
    city: {type: String},
    state_province:{type: String},
    telephone:{type: String},
    language: {type: String, default: "en"},
    verified: {type: Boolean, default: false},
    deactivated: {type: Boolean, default: false},
    private: {type: Boolean, default: false}, //set to true if the user refuses to be followed
    tokens: [new Schema({
        _id: {
            type: String,
            unique: true,
            default: require('shortid').generate,
            sparse: true,
            immutable: true
        },
        token: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        }
    }, {timestamps: true})]
}, {collection: 'users', timestamps: true});


//CHANGE THIS IN PRODUCTION
//userSchema.set('autoIndex', false);

userSchema.index({current_location: '2dsphere'}); // Ensures 2dsphere index for current_location

userSchema.plugin(immutablePlugin);

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    console.log('INFO: Encrypting users password');
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt,function(){},function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            console.log('INFO: Encrypted users password');
            next();
        });
    });
});

userSchema.method({

    /*
     GENERAL
     */
    comparePassword: function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        })},
    addToken: function(token){
        try{
            this.tokens.push({token: token});
            return new Promise(function(resolve, reject){
                resolve();
            });
        }catch(e){
            console.log(e);
            return new Promise(function(resolve, reject){
                resolve();
            });
        }

    },
    /*
     TODO: Verify removeToken error handling and every other remove error handling
     */
    removeToken: function(token, cb){
        return new Promise(function(resolve, reject){
            db.model('user', userSchema).update({"tokens.token": token},{$pull: {tokens: {token: token}}}, function(err, token){
                if(err){
                    resolve();
                }else{
                    resolve();
                }
            });
        });
    },
    loggedIn: function(token) {
        return new Promise(function(resolve, reject){
            db.model('user', userSchema).findOne({"tokens.token": token}, function(err, token){
                if(err){
                    reject(err);
                }else{
                    if(token){
                        resolve();
                    }else{
                        reject();
                    }
                }
            });
        });
    },
    loggedOut: function(token) {
        return new Promise(function(resolve, reject){
            db.model('user', userSchema).findOne({"tokens.token": token}, function(err, token){
                if(err){
                    reject(err);
                }else{
                    if(token){
                        reject();
                    }else{
                        resolve();
                    }
                }
            });
        });
    },

});


function makeError(code, message, errCode){
    var e = new Error();
    e.status = code;
    e.message = message;
    e.errorno = errCode;
    e.statusText = message;
    return e;
}

module.exports = db.model('users', userSchema);
