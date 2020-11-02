"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.away = exports.at = exports.right = exports.left = exports.down = exports.up = void 0;

var _p = _interopRequireDefault(require("p5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var up = new _p["default"].Vector(0, 1, 0);
exports.up = up;
var down = new _p["default"].Vector(0, -1, 0);
exports.down = down;
var left = new _p["default"].Vector(-1, 0, 0);
exports.left = left;
var right = new _p["default"].Vector(1, 0, 0);
exports.right = right;
var at = new _p["default"].Vector(0, 0, -1);
exports.at = at;
var away = new _p["default"].Vector(0, 0, 1);
exports.away = away;