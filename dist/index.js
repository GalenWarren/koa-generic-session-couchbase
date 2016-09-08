"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CouchbaseSessionStore = undefined;

var _couchbase = require("couchbase");

var _couchbase2 = _interopRequireDefault(_couchbase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CouchbaseSessionStore = exports.CouchbaseSessionStore = function CouchbaseSessionStore(_ref) {
  var host = _ref.host;
  var bucket = _ref.bucket;

  _classCallCheck(this, CouchbaseSessionStore);

  this.x = 2;
};