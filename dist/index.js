"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _couchbase = require("couchbase");

var _couchbase2 = _interopRequireDefault(_couchbase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function isKeyNotFound(err) {
  return err.code === 13;
}

var CouchbaseSessionStore = function (_EventEmitter) {
  _inherits(CouchbaseSessionStore, _EventEmitter);

  /**
  * Construct a couchbase session store
  *
  * @param {string}     options.connect           The couchbase connect string
  * @param {string}     options.bucketName        The bucket for session data
  * @param {string}     options.bucketPassword    The bucket password
  */
  function CouchbaseSessionStore(_ref) {
    var connect = _ref.connect;
    var bucketName = _ref.bucketName;
    var _ref$bucketPassword = _ref.bucketPassword;
    var bucketPassword = _ref$bucketPassword === undefined ? null : _ref$bucketPassword;

    _classCallCheck(this, CouchbaseSessionStore);

    var _this = _possibleConstructorReturn(this, (CouchbaseSessionStore.__proto__ || Object.getPrototypeOf(CouchbaseSessionStore)).call(this));

    _this.cluster = new _couchbase2.default.Cluster(connect);

    _this.bucket = _this.cluster.openBucket(bucketName, bucketPassword);
    _this.bucket.on("connect", function () {
      _this.emit("connect", _this);
    });

    _this.bucket.on("error", function (err) {
      _this.emit("error", err);
    });

    return _this;
  }

  /**
  * Gets a session object by id
  *
  * @param {string}     id          The id to look up
  * @returns {Promise}              Promise resolves to the session object
  */


  _createClass(CouchbaseSessionStore, [{
    key: "get",
    value: function get(id) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.bucket.get(id, function (err, doc) {
          if (err) {
            if (isKeyNotFound(err)) {
              resolve(null);
            } else {
              reject(err);
            }
          } else {
            resolve(doc.value);
          }
        });
      });
    }

    /**
    * Sets a session object by id
    *
    * @param {string}     id          The id to look up
    * @param {object}     session     The session object
    * @param {int}        ttl         The time to live, in ms
    * @returns {Promise}              Promise resolves when done
    */

  }, {
    key: "set",
    value: function set(id, session, ttl) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.bucket.upsert(id, session, {
          expiry: ttl / 1000
        }, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    /**
    * Destroys a session object by id
    *
    * @param {string}     id          The id to look up
    * @returns {Promise}              Promise resolves when done
    */

  }, {
    key: "destroy",
    value: function destroy(id) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.bucket.remove(id, function (err) {
          if (err) {
            if (isKeyNotFound(err)) {
              resolve();
            } else {
              reject(err);
            }
          } else {
            resolve();
          }
        });
      });
    }
  }]);

  return CouchbaseSessionStore;
}(_events.EventEmitter);

exports.default = CouchbaseSessionStore;