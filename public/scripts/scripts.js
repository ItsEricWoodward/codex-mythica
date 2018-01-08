/****************************************************************************
 * The Codex Mythica
 *
 * Copyright 2017 Eric Woodward
 * Source released under CC0 Public Domain License v1.0
 * http://creativecommons.org/publicdomain/zero/1.0/
 ****************************************************************************/
;
(function(){
  'use strict';

  // Checking if browser "cuts the mustard" - https://gomakethings.com/ditching-jquery/
  if ( !(!!document.querySelector && !!window.addEventListener) ) return;

  var
    protocol = window.location.protocol;

  // Indicate JS is loaded
  document.documentElement.className = document.documentElement.className.replace('no-js', 'js');

  // Enable cached fonts ASAP
  if (typeof Cookies !== 'undefined' && !!Cookies.get('fonts_loaded')) {
    document.documentElement.className += " js-hasFontsLoaded";
  }
  docReady(function() {
    setTimeout(function() {
      // Handle Fonts
      if (typeof Cookies !== 'undefined') {
        if (typeof FontFaceObserver !== 'undefined') {
          var
            font_ls = new FontFaceObserver('liberation_serif'),
            font_msc = new FontFaceObserver('marcellus_sc');
          Promise.all([
            font_ls.load(),
            font_msc.load()
          ]).then(function () {
            if (document.documentElement.className.indexOf("js-hasFontsLoaded") == -1) {
              document.documentElement.className += " js-hasFontsLoaded";
            }
            Cookies.set('fonts_loaded', true);
          });
        }
      }

      // Lazy-Load Media
      if (typeof loadMedia === 'function') {
        loadMedia('.js-lazyLoader', null, true);
      }
      
      document
        .querySelectorAll('.js-checkToggle')
        .forEach(function (el) {
          el
            .addEventListener('click', function() {
              let
                checks =
                  document
                    .querySelectorAll('input[name="' + this.htmlFor + '"]'),
                is_checked = !!checks && checks.length > 0 ? checks[0].checked : false;
              checks.forEach(function(check) {
                check.checked = !is_checked;
              });
            });
        });
      
      /*
      document
        .querySelectorAll('.js-ulToggle')
        .forEach(function (el) {
          el.parentNode.classList.add('js-ulToggle-hidden')
          el
            .addEventListener('click', function() {
//              let list = this.parentNode.querySelector('.js-ulToggle-list');
              let fieldset = this.parentNode;
              if (fieldset && fieldset.className) {
                if (fieldset.className.indexOf('js-ulToggle-hidden') === -1) {
                  fieldset.classList.add('js-ulToggle-hidden');
                } else {
                  fieldset.classList.remove('js-ulToggle-hidden');
                }
              }
            });
        });
      */
      
      
      // fix search link on 404
      if (document.documentElement.className.indexOf('is404') > -1) {
        document
          .getElementById("searchQuery")
          .value =
            window
              .location
              .pathname
              .replace(/\\.html?$/, "")
              .replace(/\//g, " ");
      }
      
    }, 1);
  });
}());
