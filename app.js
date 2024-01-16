var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth');

var app = express();

// Allow cors connection
app.use(cors({
  credentials: true, origin: 'http://localhost:5173'
}));
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5173',
  changeOrigin: true,
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}))

//Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_ACCESS;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB)
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).exec();

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/auth', authRouter);

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
