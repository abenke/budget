var _        = require("underscore"),
    express  = require("express"),
    mongoose = require('mongoose'),
    http     = require('http'),
    app      = express(),
    Schema   = mongoose.Schema;

console.log('connecting to mongoDB...');
var db = mongoose.connect('mongodb://localhost/budget').connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  var Budget = mongoose.model('Budget', new Schema({
    currentBalance: Number,
    transactions: [new Schema({
      name: String,
      amount: Number,
      start: Date,
      end: Date,
      type: String,
      unit: String,
      every: Number
    })]
  }));

  app.configure(function() {
    app.set('view engine', 'ejs');
    app.set('views', __dirname+'/views');

    app.use(express.methodOverride());
    app.use(express.bodyParser());

    app.use(express.static('public'));
    app.use(express.logger());
    app.use(app.router);

    app.use(express.errorHandler({
      dumpExceptions: true, 
      showStack: true
    }));
  });

  app.get("/", function(req, res) {
    res.render('index');
  });

  app.get("/api/budget", function(req, res) {
    Budget.findOne({}, function(err, budget) {
      res.end(JSON.stringify(budget.toJSON()));
    });
  });

  app.post("/api/budget", function(req, res) {
    new Budget(req.body).save(function() {
      res.end();
    });
  });

  app.put("/api/budget", function(req, res) {
    Budget.update({}, {$set: req.body}, {upsert: true}, function(err) {
      res.end();
    });
  });

  console.log('starting express server...');
  http.createServer(app).listen(4000);
});
