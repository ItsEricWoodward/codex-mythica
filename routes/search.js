'use strict';


const
  express = require('express'),
  sortByField = function(field, order, list) {
    field = (field || 'num');
    order = (order || 'asc');
    let
      coll_opts = {
        sensitivity: 'accent',
        numeric: true,
        caseFirst: "upper"
      },
      coll = new Intl.Collator({}, coll_opts);
    list.sort((a,b) => {
      if (a[field] && b[field]) {
        let res = coll.compare(a[field], b[field]) * (order !== 'asc' ? -1 : 1);
        if (res === 0 && field !== 'name') {
          return coll.compare(a['name'], b['name']) * (order !== 'asc' ? -1 : 1);
        }
        return res;
      }
      return 1;
    });
    return list;
  };

let router = express.Router();

/* GET search results page. */
router.get('/', function(req, res) {
  req.query = req.query || {};
  let filtered = [];
  if (Object.keys(req.query).length > 0) {
    let
      q = req.query,
      cards = require('../lib/cards.json');
    q.search_in = (q.search_in || []);
    q.search_for = (q.search_for || '').trim().toLowerCase();
    q.pantheons = (q.pantheons || []);
    q.pantheons = Array.isArray(q.pantheons) ? q.pantheons : [q.pantheons];
    q.elements = (q.elements || []);
    q.elements = Array.isArray(q.elements) ? q.elements : [q.elements];
    q.types = (q.types || []);
    q.types = Array.isArray(q.types) ? q.types : [q.types];
    q.races = (q.races || []);
    q.races = Array.isArray(q.races) ? q.races : [q.races];
    q.releases = (q.releases || []);
    q.releases = Array.isArray(q.releases) ? q.releases : [q.releases];
    q.sort_by = (q.sort_by || 'num').trim().toLowerCase();
    q.sort_order = (q.sort_order || 'asc').trim().toLowerCase();

    console.log(`sort_by: ${q.sort_by}`);

    filtered = cards.filter(card => {

        if (q.search_in.length > 0 && q.search_for.trim() !== '') {
          if (!(
            (q.search_in.indexOf('name') > -1 && (card.name.toLowerCase().indexOf(q.search_for) > -1 || card.name_ang.indexOf(q.search_for) > -1)) ||
            (q.search_in.indexOf('ability') > -1 && (card.ability_name.toLowerCase().indexOf(q.search_for) > -1 || card.ability_text.toLowerCase().indexOf(q.search_for) > -1)))) {
              return false;
            }

        }

        if (q.pantheons.length > 0 && card.pantheon) {
          let
            has_pantheon = false;
          for (let i=0; i < q.pantheons.length; i++) {
            if (card.pantheon_idx.indexOf(q.pantheons[i]) > -1) {
              has_pantheon = true;
            }
          }
          if (!has_pantheon) {
            return false;
          }
        }

        if (q.elements.length > 0) {
          let
            has_element = false;
          for (let i=0; i < q.elements.length; i++) {
            if (card.element_idx.indexOf(q.elements[i]) > -1) {
              has_element = true;
            }
          }
          if (!has_element) {
            return false;
          }
        }

        if (q.races.length > 0 && card.race) {
          let
            has_race = false;
          for (let i=0; i < q.races.length; i++) {
            if (card.race_idx.indexOf(q.races[i]) > -1) {
              has_race = true;
            }
          }
          if (!has_race) {
            return false;
          }
        }

        if (q.types.length > 0) {
          let
            has_type = false;
          for (let i=0; i < q.types.length; i++) {
            if (card.type_idx.indexOf(q.types[i]) > -1) {
              has_type = true;
            }
          }
          if (!has_type) {
            return false;
          }
        }

        if (q.releases.length > 0) {
          let
            has_release = false;
          for (let i=0; i < q.releases.length; i++) {
            if (card.num.toLowerCase().indexOf(q.releases[i]) > -1) {
              has_release = true;
            }
          }
          if (!has_release) {
            return false;
          }
        }

        return true;
      });
    if (q.sort_by !== 'name') {
      filtered = sortByField('name', q.sort_order, filtered);
    }
    filtered = sortByField(q.sort_by, q.sort_order, filtered);
  }

  res.render('search', { title:`Search Results (${filtered.length})`, query: req.query, cards: filtered });
});

module.exports = router;
