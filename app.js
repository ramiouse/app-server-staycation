//-----------------------------------------------------------------------------
// APP REQUIRES MODULES
//-----------------------------------------------------------------------------
var express = require("express");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// method "method-override"
const methodOverride = require("method-override");
// method "express-session"
const session = require("express-session");
// method "connect-flash"
const flash = require("connect-flash");
// connect mongoose
const mongoose = require("mongoose");
// const createProxyMiddleware = require("http-proxy-middleware");

const options = {
  autoIndex: true, // Don't build indexes
  autoCreate: true, // Don't build indexes
};
// mongoose.connect("mongodb://localhost:27017/db_staycation", options);
mongoose.connect(
  "mongodb+srv://codeathome:bwamern01@cluster0.c2mnsqb.mongodb.net/db_staycation?retryWrites=true&w=majority",
  options
);

var cors = require("cors");
var app = express();

// const settingProxy = createProxyMiddleware({
//   target:
//     "https://admin-staycation-new.herokuapp.com/api/v1/member/landing-page",
//   changeOrigin: true,
//   on: {
//     proxyReq: (proxyReq, req, res) => {
//       /* handle proxyReq */
//       console.log(res);
//     },
//     proxyRes: (proxyRes, req, res) => {
//       /* handle proxyRes */
//       console.log(res);
//     },
//     error: (err, req, res) => {
//       console.log(err);
//       /* handle error */
//     },
//   },
// });

// var corsSettings = {
//   origin: "http://localhost:3000",
// };

// used for anticipate access origin error
app.use(cors());
// app.use(settingProxy);

// --------------------------------------------------- CORS SETTINGS

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users"); // router users
const adminRouter = require("./routes/admin"); // router admin
const apiRouter = require("./routes/api"); // router admin

//-----------------------------------------------------------------------------
// APP SETTING MODULE
//-----------------------------------------------------------------------------

// setting default acces for "views" folder
app.set("views", path.join(__dirname, "views"));
// setup & use "view engine"
app.set("view engine", "ejs");
// method 'override' use
app.use(methodOverride("_method"));
// method "express-session" use, to handling 'flash'
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { expires: 600000 }, // 1 jam expires
  })
);
// method "connect-flash" use
app.use(flash());

// method "logger" use
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setting default path for 'access public folder'
app.use(express.static(path.join(__dirname, "public")));
// setting default path for 'access bootstraps folder in node modules'
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

// setting 'route' for uri
app.use("/", indexRouter); // default routes
app.use("/users", usersRouter); // user routes
app.use("/admin", adminRouter); // admin routes
app.use("/api/v1/member", apiRouter); // api routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
