var express = require('express');
var app = express();
var uuid = require('node-uuid');
var mysql = require('mysql2');

// MySQL connection configuration
const conString = {
    user: process.env.DBUSER,
    database: process.env.DB,
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: process.env.DBPORT
};

var pool = mysql.createPool(conString);

// Health check endpoint
app.get('/health', function(req, res) {
  res.status(200).send('OK');
});

// Routes
app.get('/api/status', function(req, res) {
  // connection using created pool
  pool.getConnection((err, connection) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    connection.query('SELECT NOW() AS time', (err, result) => {
      connection.release();
      if (err) {
        console.log(err);
        return console.error('Error executing query', err.stack);
      }
      res.status(200).send(result);
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;

