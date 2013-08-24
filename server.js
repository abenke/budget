var _       = require("underscore"),
    express = require("express"),
    mongoose = require('mongoose'),
    app     = express();

console.log('connecting to mongoDB...');
var db = mongoose.connect('mongodb://localhost/budget').connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // TODO define model
  // var Post = mongoose.model('Post', { date: Date, text: String });

  app.get("/", function(req, res) {
    res.render('index');
  });

  app.get("/api/budget", function(req, res) {
    TODO
    // Post.count({}, function(err, count) {
    //   var body = JSON.stringify({
    //     name: 'Naive Thoughts',
    //     num_posts: count
    //   });
    //   res.setHeader('Content-Type', 'application/json');
    //   res.setHeader('Content-Length', body.length);
    //   res.end(body);
    // });
  });

  app.configure(function(){
    app.set('view engine', 'ejs');
    app.set('views', __dirname+'/views');

    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({
      dumpExceptions: true, 
      showStack: true
    }));
    app.use(function(req, res, next){
      console.log('%s %s', req.method, req.url);
      next();
    });
    app.use(app.router);
  });

  console.log('starting express server...');
  app.listen(4000);
});
