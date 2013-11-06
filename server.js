var _        = require("underscore"),
    express  = require("express"),
    mongoose = require('mongoose'),
    http     = require('http'),
    app      = express(),
    Schema   = mongoose.Schema;

// connect to mongo database
console.log('connecting to mongoDB...');
var db = mongoose.connect('mongodb://localhost/budget').connection;

// error connecting to mongo
db.on('error', console.error.bind(console, 'connection error:'));

// successful connection to mongo
db.once('open', function () {

  // create mongoose model
  var Budget = mongoose.model('Budget', new Schema({
    currentBalance: Number,

    // each budget has an array of transactions objects
    transactions: [new Schema({
      name: String,
      amount: Number,
      type: String,
      unit: String,
      frequency: Number,
      specifics: Array
    })]
  }));

  app.configure(function() {
    // set ejs as view rendering engine
    app.set('view engine', 'ejs');
    app.set('views', __dirname+'/views');

    app.use(express.methodOverride());
    app.use(express.json());
    app.use(express.urlencoded());

    // serves frontend application
    app.use(express.static('public'));

    app.use(express.logger());
    app.use(app.router);

    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  // serves index ejs file
  app.get("/", function(req, res) {
    res.render('index');
  });

  // endpoint to get budget
  app.get("/api/budget", function(req, res) {
    // for now, get the first budget in the db
    Budget.findOne({}, function(err, budget) {
      if (budget) {
        res.end(JSON.stringify(budget.toJSON()));
      } else {
        res.statusCode = 404;
        res.end();
      }
    });
  });

  // endpoint to create a new budget
  app.post("/api/budget", function(req, res) {
    new Budget(req.body).save(function(err, budget) {
      res.end(JSON.stringify(budget.toJSON()));
    });
  });

  // endpoint to update a budget
  app.put("/api/budget", function(req, res) {
    // currently updates all budgets in the collection to the new budget
    Budget.update({}, {$set: req.body}, {upsert: true}, function(err) {
      res.end();
    });
  });

  // start express server
  console.log('starting express server...');
  http.createServer(app).listen(4000);
});
