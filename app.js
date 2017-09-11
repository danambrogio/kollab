var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var config = require('./config');
var version = require('./version');
var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var kollab = require('./routes/kollab');

var app = express();

var connection = require('express-myconnection');
var mysql = require('mysql');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//initialize mysql DB, create tables, migrate DB schema
var initConnection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  port: config.port,
  multipleStatements: true
})

initConnection.query('CREATE DATABASE IF NOT EXISTS ' + config.database, function (err) {
    if (err) throw err;

    initConnection.query('USE ' + config.database, function (err) {
        if (err) throw err;

        //check if settings table exists
        initConnection.query('SELECT * FROM information_schema.tables WHERE `table_schema` = \''  + config.database + '\' AND `table_name` = \'settings\'', function (err, rows) {
          
          if (rows.length) { //settings table exists
            //TODO: check settings db_version and upgrade database schema here
            initConnection.query('SELECT * FROM settings WHERE `key` = \'db_version\'', function (err, rows){

              for (var version = rows[0].value; version < version.db; version++) {
                var alterScriptNumber = version + 1;
                console.log('migrating db schema to version: ' + runAlterScript);
                var loadAlterScript = fs.readFileSync('scripts/migrate' + alterScriptNumber + '.sql', {encoding: 'utf8'});
                initConnection.query(loadAlterScript, function (err){
                  if (err) throw err;
                  console.log('..finished')
                })

              }
            })


          }
          else { //settings table does not exist
            var createTables = fs.readFileSync('scripts/createTables.sql', { encoding: 'utf8' });
            console.log('creating new database tables');

            initConnection.query(createTables, function (err){
              if (err) throw err;
              console.log('database tables created')
            })

          }

        });

    });
});


//express-myconnection middleware: mysql pool
app.use(

  connection(mysql,{
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.database
  },'pool')

);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/kollab', kollab);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
