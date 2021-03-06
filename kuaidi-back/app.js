var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var adminRouter = require('./routes/admin');
var customerRouter = require('./routes/customer');

var mysql = require('mysql');
var mysqlConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'woaiKuaidi!23',
    database: 'PostOffice'
});

function handleDisconnect(conn) {
    conn.on('error', function (err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            // throw err;
            console.log(err.code);
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        mysqlConn = mysql.createConnection(conn.config);
        handleDisconnect(mysqlConn);
        mysqlConn.connect();
        app.set('mysqlConn', mysqlConn);
    });
}
handleDisconnect(mysqlConn);
mysqlConn.connect();


var app = express();
app.set('mysqlConn', mysqlConn);
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'kuaidi-front')));


app.all(/.*/, function (req, res, next) {
    var host = req.header("host");
    if (host.match(/^www\..*/i)) {
        next();
    } else {
        res.redirect(301, "http://www." + host);
    }
});

// app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/customer/', customerRouter);
app.all('/*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('kuaidi-front/index.html', { root: __dirname });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;