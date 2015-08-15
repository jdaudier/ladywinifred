var express = require('express');
var router = express.Router();

/* GET VIP page. */
router.get('/', function(req, res, next) {
    res.render('vip');
});

module.exports = router;
