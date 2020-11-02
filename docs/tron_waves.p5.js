"use strict";

var _p = _interopRequireDefault(require("p5"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

new _p["default"](function (sk) {
  sk.setup = function () {
    sk.pixelDensity(1);
    sk.createCanvas(1000, 500, sk.WEBGL);
  };

  var counter = function counter() {
    return sk.millis() / 1000;
  };

  var drawLines = function drawLines(x1, x2) {
    return _toConsumableArray(new Array(20)).forEach(function (v, i) {
      return sk.line(x1, 20 * i, x2, 20 * i);
    });
  };

  sk.draw = function () {
    sk.clear(); // for every block of width 
    // canvas width / BLOCKS = width   next 

    var BLOCKS = 80;
    var WIDTH = sk.canvas.width / BLOCKS;

    for (var i = 0; i < BLOCKS; i++) {
      sk.push();
      sk.rotateX(counter() / (i / 20 + 1));
      sk.stroke('blue');
      var x1 = -sk.canvas.width / 2 + WIDTH * i;
      var x2 = x1 + WIDTH;
      drawLines(x1, x2);
      sk.pop();
    } // drawLines();

  };
});