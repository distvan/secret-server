const express = require('express');
const router = express.Router();
const SecretData = require('../models/secret-data');
const {check, validationResult} = require('express-validator');
const jwt = require('jwt-simple');
const config = require('../config');
const mongoose = require('mongoose');
let url = config.MONGODB_URL;
if(url == ''){
  url = `mongodb://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@${config.MONGO_HOSTNAME}:${config.MONGO_PORT}/${config.MONGO_DB}?authSource=admin`;
}
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  connectTimeoutMS: 10000
}
mongoose.connect(url, options).then(function(){
  console.log('MongoDB is connected');
})
.catch(function(err){
  console.log(err);
})

/**
 * Get info about secret using hash but return empty if it expires
 * @param hash String
 * 
 * @return {
 *  "hash": "[The hash of the string]",
 *  "secretText": "[The original text]",
 *  "createdAt": "[The Timestamp the secret was created]",
 *  "expiresAt": "[The Timestamp the secret if TTL is given]",
 *  "remainingViews": 0 
 * }
 */
router.get('/secret/:hashValue',[
  check('hashValue').isString().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      })
    }
    //find not expired data with input hash
    SecretData.findOne({
        'hash_value': req.params.hashValue,
        'expires_at': {
          $gt: new Date()
        }
    }).sort({'created_at': -1})
    .then((result) => {
      //show secret data
      if(result != null) {
        viewCount = result.view_count;
        if(viewCount > 0) {
          secretText = jwt.decode(result.hash_value, config.JWT_SECRET);
          res.json({
            "hash": result.hash_value,
            "secretText": secretText.content,
            "createdAt": result.created_at,
            "expiresAt": result.expires_at,
            "remainingViews": parseInt(viewCount)
          })
          --viewCount;
          //update data in database because restrictions of number of views
          const data = new SecretData();
          SecretData.updateOne({"_id":result._id}, {"view_count": viewCount})
          .catch((error) => {
            console.error(error)
          });
        }else{
          //nothing show because it hasn't enough viewcount
          res.json({});  
        }
      }else{
        //nothing show because token expired or it is not registered
        res.json({});
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
    })
});

/**
 * Get checked and sanitized input parameters and generate encrypted JWT token
 * and put it into database
 * 
 * @param secret String, a text content
 * @param expireAfterViews Integer, if it is zero, never expires
 * @param expireAfter Integer, TTL in minutes
 * 
 * @return {
 *  "hash": "[The hash of the string]",
 *  "secretText": "[The original text]",
 *  "createdAt": "[The Timestamp the secret was created]",
 *  "expiresAt": "[The Timestamp the secret if TTL is given]",
 *  "remainingViews": 0 
 * }
 * @errors json if input data is invalid
 */
router.post('/secret', [
  check('secret').isString().trim().escape(),
  check('expireAfterViews').isInt(),
  check('expireAfter').isInt()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      })
    }
    const secretContent = req.body.secret;
    const expireAfterViews = req.body.expireAfterViews;
    const expireAfter = req.body.expireAfter;
    const payload = {
      content: secretContent 
    }
    let now = new Date();
    let expirationValue = (60 * 1000 * expireAfter);
    if (expireAfter == 0) {
      //100 years
      expirationValue = (60 * 1000 * 60 * 24 * 365 * 100);
    }
    let expiration = new Date(Date.now() + expirationValue);
    const hashValue = jwt.encode(payload, config.JWT_SECRET);
    const data = new SecretData({
      "hash_value": hashValue,
      "view_count": expireAfterViews,
      "created_at": now,
      "expires_at": expiration,
    });
    data.save().catch((error) => {
      console.log(error);
    });
    res.json({
      "hash": hashValue,
      "secretText": secretContent,
      "createdAt": now,
      "expiresAt": expiration,
      "remainingViews": parseInt(expireAfterViews)
    });
});

module.exports = router;