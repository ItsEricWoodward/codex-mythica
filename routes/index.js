'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Welcome', query: (req.query || {}) });
});

router.get('/cards/:card_num', (req, res) => {
  req.params.card_num = (req.params.card_num || 'all');
  let
    cards = require('../lib/cards.json'),
    filtered = cards.filter(card => card.num.toLowerCase().indexOf(req.params.card_num.toLowerCase()) > -1 || req.params.card_num.toLowerCase() === 'all');

  if (filtered.length === 1) {
    res.render('single', { title: filtered[0].name + ' (' + filtered[0].num + ')', card: filtered[0] });
  } else {
    res.render('all', { title: 'All Cards', cards: filtered });
  }
});

router.get('/cards', function(req, res) {
  res.redirect('/cards/all');
});


module.exports = router;
