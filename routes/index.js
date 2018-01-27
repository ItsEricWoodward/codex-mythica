'use strict';

const
  express = require('express'),
  sortByName = function(list) {
    let
      coll_opts = {
        sensitivity: 'accent',
        numeric: true,
        caseFirst: "upper"
      },
      field = 'name',
      coll = new Intl.Collator({}, coll_opts);
    list.sort((a,b) => {
      if (a[field] && b[field]) {
        return coll.compare(a[field], b[field]);
      }
      return 1;
    });
    return list;
  };
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  let
    cards = require('../lib/cards.json'),
    rand_card_num = Math.floor(Math.random() * Math.floor(cards.length-1));

  res.render('index', { title: 'Welcome', query: (req.query || {}), card: cards[rand_card_num], random_num: rand_card_num });
});

router.get('/cards/:card_num', (req, res) => {
  req.params.card_num = (req.params.card_num || 'all');
  let
    cards = require('../lib/cards.json'),
    links = require('../lib/links.json'),
    filtered = cards.filter(card =>
        card.num.toLowerCase().indexOf(req.params.card_num.toLowerCase()) > -1 || req.params.card_num.toLowerCase() === 'all'
      );
  if (filtered.length === 1) {
    let card = filtered[0];
    if (links && card.hasOwnProperty('name') && links.hasOwnProperty(card.name)) {
      Object.assign(card, links[card.name]);
    }
    res.render('single', { title: card.name + ' (' + card.num + ')', card: card });
  } else {
    filtered = sortByName(filtered);
    res.render('all', { title: 'All Cards', cards: filtered });
  }
});

router.get('/cards', function(req, res) {
  res.redirect('/cards/all');
});

module.exports = router;
