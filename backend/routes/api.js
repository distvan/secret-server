var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');

router.get('/secret/:hashValue', function(req, res, next) {
  //req.params.hashValue;
  res.send('API secret GET:');
});

/**
 * Get checked and sanitized input parameters and generate encrypted JWT token
 */
router.post('/secret', [
  check('secret').isString().trim().escape(),
  check('expireAfterViews').isInt(),
  check('expireAfter').isInt()
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(422).json({errors: errors.array()})
    }
    const secret = req.body.secret;
    const expireAfterViews = req.body.expireAfterViews;
    const expireAfter = req.body.expireAfter;
    
  res.send('API secret POST:' + secret + ' ' + expireAfterViews + ' ' + expireAfter);
});

module.exports = router;
