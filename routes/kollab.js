var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('kollab', { 
    // Pass in values
    username: 'atypicaloddity'
  });
});

module.exports = router;
