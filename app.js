require('dotenv').config()
var jwt = require('jsonwebtoken')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var productRouter = require('./routes/product');
var categoryRouter = require('./routes/category');
var brandRouter = require('./routes/brand');
var cartRouter = require('./routes/cart');
var orderRouter = require('./routes/order');
var membershipRouter = require('./routes/membership');
var utilityRouter = require('./routes/utility');
var adminRouter = require('./routes/admin');


var db = require('./models');
db.sequelize.sync({ force: true });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/brands', brandRouter);
app.use('/membership', membershipRouter);
app.use('/orders', orderRouter);
app.use('/cart', cartRouter);
app.use('/utility', utilityRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
