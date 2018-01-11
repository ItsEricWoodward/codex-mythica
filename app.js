var
  express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  compression = require('compression'),
  minify = require('express-minify')
  uglifyEs = require('uglify-es'),

  routes = require('./routes/index'),
  search = require('./routes/search'),

  pkg = require('./package'),
  app = express();

Object.assign(
  app.locals, {
    mw_site_uri: 'https://mythicwarsgame.com',
    site: {
      title: 'The Codex Mythica',
      description: "The Codex Mythica is a database of all of the cards released for the Mythic Wars card game. Browse through all of the cards in the game, or search to find the card(s) you're looking for.",
      keywords: 'codex, card game, mythic cards, mythic wars cards, mythic wars, clash of the gods, cthulhu rises, nemesis, excalibre, collectible card game, ccg, mythic sets, game, multiplayer, hobby, zeus, thor',
      base_uri: (process.env.NODE_ENV || '').toLowerCase().indexOf('dev') > -1 ? 'http://localhost:8320' : 'https://codex.mythicwarsgame.com'
    },
    author: {
      name: pkg.author.name,
      contact: pkg.author.email
    }
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use((req, res, next) => {
  if (req && req.originalUrl && res) {
    res.locals.originalUrl = req.originalUrl;
  }
  next();
});
app.use(compression());
app.use(function(req, res, next)
{
  res.minifyOptions = res.minifyOptions || {};
  res.minifyOptions.js = { output: { comments: 'some' } };
  res.minifyOptions.css = { output: { comments: 'some' } };
  if (/libs\.min\.js$/.test(req.url)) {
    res.minifyOptions.minify = false;
  }
  next();
});
app.use(minify({
    cache: 'minify-cache',
    uglifyJsModule: uglifyEs,
    sassMatch: false,
    lessMatch: false,
    stylusMatch: false,
    coffeeScriptMatch: false
  }));

app.use('/', routes);
app.use('/search/', search);

app.use(express.static(path.join(__dirname, 'public')));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  res.status(404).sendFile(path.join(__dirname + '/public/errors', '404.html'));
});

/// error handlers

// development error handler
// will print stacktrace
if ((process.env.NODE_ENV || '').toLowerCase().indexOf('dev') > -1 ) {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;
