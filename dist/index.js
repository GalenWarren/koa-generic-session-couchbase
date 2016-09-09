"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodePromisify = require("node-promisify");

var _nodePromisify2 = _interopRequireDefault(_nodePromisify);

var _events = require("events");

var _couchbase = require("couchbase");

var _couchbase2 = _interopRequireDefault(_couchbase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CouchbaseSessionStore = function (_EventEmitter) {
  _inherits(CouchbaseSessionStore, _EventEmitter);

  function CouchbaseSessionStore(_ref) {
    var connect = _ref.connect;
    var bucketName = _ref.bucketName;
    var _ref$bucketPassword = _ref.bucketPassword;
    var bucketPassword = _ref$bucketPassword === undefined ? null : _ref$bucketPassword;
    var _ref$open = _ref.open;
    var open = _ref$open === undefined ? true : _ref$open;

    _classCallCheck(this, CouchbaseSessionStore);

    var _this = _possibleConstructorReturn(this, (CouchbaseSessionStore.__proto__ || Object.getPrototypeOf(CouchbaseSessionStore)).call(this));

    _this.cluster = new _couchbase2.default.Cluster(connect);

    _this.bucket = _this.cluster.openBucket(bucketName, bucketPassword, function (err) {
      if (err) {
        _this.emit("error", err);
      } else {
        _this.emit("connect", _this);
      }
    });

    _this.bucket.on("error", function (err) {
      _this.emit("error", err);
    });

    _this.bucket = (0, _nodePromisify2.default)(_this.bucket);

    return _this;
  }

  _createClass(CouchbaseSessionStore, [{
    key: "get",
    value: async function get(sid) {
      return await this.bucket.get(sid);
    }
  }, {
    key: "set",
    value: async function set(sid, session) {
      return await this.bucket.upsert(sid, session);
    }
  }]);

  return CouchbaseSessionStore;
}(_events.EventEmitter);

exports.default = CouchbaseSessionStore;