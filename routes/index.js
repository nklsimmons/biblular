var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  var s = req.body.s;
  console.log(s);
  // return s;
  res.send(s);
  // res.render('index', { title: 'Express' });
});

module.exports = router;
