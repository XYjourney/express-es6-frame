/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./bin/www.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./apis/admin.js":
/*!***********************!*\
  !*** ./apis/admin.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _ret = __webpack_require__(/*! ../lib/ret.class */ "./lib/ret.class.js");

var _ret2 = _interopRequireDefault(_ret);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = __webpack_require__(/*! express */ "express");
var router = express.Router();
var passport = __webpack_require__(/*! ../config/passport.config */ "./config/passport.config.js");


router.post('/signup', passport.authenticate('local.signup', {
    failureFlash: true
}), function (req, res, next) {
    res.json(new _ret2.default('200', '注册成功', true));
});

router.post('/login', passport.authenticate('local.login', {
    failureFlash: true
}), function (req, res) {
    res.json(new _ret2.default('200', '登录成功', true));
});
module.exports = router;

/***/ }),

/***/ "./apis/index.js":
/*!***********************!*\
  !*** ./apis/index.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var admin = __webpack_require__(/*! ./admin */ "./apis/admin.js");
var express = __webpack_require__(/*! express */ "express");
var router = express.Router();
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/index.html#/admin/login');
  }
}
router.get('/', function (req, res) {
  res.redirect('/apidoc/index.html');
});
module.exports = function (app) {
  app.use('/', router);
  // app.use('/admin', admin);
};

/***/ }),

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(/*! express */ "express");
var path = __webpack_require__(/*! path */ "path");
var favicon = __webpack_require__(/*! serve-favicon */ "serve-favicon");
var logger = __webpack_require__(/*! morgan */ "morgan");
var cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
var bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
var session = __webpack_require__(/*! express-session */ "express-session");
var flash = __webpack_require__(/*! connect-flash */ "connect-flash");
var validator = __webpack_require__(/*! express-validator */ "express-validator");
var MongoStore = __webpack_require__(/*! connect-mongo */ "connect-mongo")(session);
var mongoose = __webpack_require__(/*! mongoose */ "mongoose");
var passport = __webpack_require__(/*! ./config/passport.config */ "./config/passport.config.js");
var routes = __webpack_require__(/*! ./apis/index */ "./apis/index.js");
var methodOverride = __webpack_require__(/*! method-override */ "method-override");
var multer = __webpack_require__(/*! multer */ "multer");
var errorHandler = __webpack_require__(/*! errorhandler */ "errorhandler");
var log4js = __webpack_require__(/*! log4js */ "log4js");

var app = express();

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    menu: {
      type: 'file', //文件输出
      filename: 'logs/access.log',
      replaceConsole: true
    }
  },
  categories: {
    default: {
      appenders: ['menu'],
      level: 'info'
    }
  }
});

var logger = log4js.getLogger('share');
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));

// override是为了改变表单提交get/post的请求以适应接口，比如put
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(session({
  secret: 'share4mongodb',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: { maxAge: 180 * 60 * 1000 //store保存时间
  } }));
//对session操作的模块，应在session实例下面
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function setHeaders(res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
};
app.use('/', express.static(path.join(__dirname, '../public'), options));
// 路由配置
routes(app);
// 错误处理中间件应当在路由加载之后才能加载
if ('development' == app.get('env')) {
  app.use(errorHandler());
}
module.exports = app;

/***/ }),

/***/ "./bin/www.js":
/*!********************!*\
  !*** ./bin/www.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// #!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = __webpack_require__(/*! ../app */ "./app.js");
var debug = __webpack_require__(/*! debug */ "debug")('init:server');
var http = __webpack_require__(/*! http */ "http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/***/ }),

/***/ "./config/passport.config.js":
/*!***********************************!*\
  !*** ./config/passport.config.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var passport = __webpack_require__(/*! passport */ "passport");

var User = __webpack_require__(/*! ../models/user.js */ "./models/user.js");
var localStategy = __webpack_require__(/*! passport-local */ "passport-local").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new localStategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //此处为true，下面函数的参数才能有req
}, function (req, user, password, done) {
    User.findOne({ 'username': user }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: "此名称已经被注册" });
        }
        var newUser = new User();
        newUser.username = user;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.login', new localStategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true //此处为true，下面函数的参数才能有req
}, function (req, user, password, done) {
    User.findOne({ 'username': user }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "用户名错误!" });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: "密码错误!" });
        }
        return done(null, user);
    });
}));

module.exports = passport;

/***/ }),

/***/ "./lib/ret.class.js":
/*!**************************!*\
  !*** ./lib/ret.class.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//定义类
var _class = function _class(x, y, z) {
  _classCallCheck(this, _class);

  this.retCode = x;
  this.retMes = y;
  this.ret = z;
};

exports.default = _class;

/***/ }),

/***/ "./models/user.js":
/*!************************!*\
  !*** ./models/user.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// var mongoose = require('../config/mongodb.config');
// var bcrypt = require('bcrypt-nodejs');

// var schema = mongoose.Schema;

// var userSchema = new schema({
//     username: { type: String, required: true },
//     password: { type: String, required: true }
// });
// userSchema.methods.encryptPassword = function(password){
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
// };

// userSchema.methods.validPassword = function(password){
//     return bcrypt.compareSync(password, this.password);
// };

// module.exports = mongoose.model('user', userSchema);


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "connect-flash":
/*!********************************!*\
  !*** external "connect-flash" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-flash");

/***/ }),

/***/ "connect-mongo":
/*!********************************!*\
  !*** external "connect-mongo" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("connect-mongo");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "errorhandler":
/*!*******************************!*\
  !*** external "errorhandler" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("errorhandler");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "express-validator":
/*!************************************!*\
  !*** external "express-validator" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-validator");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "log4js":
/*!*************************!*\
  !*** external "log4js" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("log4js");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("method-override");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "serve-favicon":
/*!********************************!*\
  !*** external "serve-favicon" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("serve-favicon");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map