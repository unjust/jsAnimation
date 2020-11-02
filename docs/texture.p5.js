"use strict";

var _p = _interopRequireDefault(require("p5"));

var _soundTools = require("Framework/soundTools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

new _p["default"](function (sk) {
  var midiValue;

  var setMidiValue = function setMidiValue(value) {
    return midiValue = value;
  };

  var bins = 1024;

  sk.setup = function () {
    sk.pixelDensity(1);
    sk.createCanvas(1000, 500, sk.WEBGL);
    sk.background('#c6c1b8');
    sk.stroke('black');
    sk.strokeWeight(1);
    sk.noFill();
    (0, _soundTools.initAudioIn)();
    (0, _soundTools.initFFT)(bins);
    (0, _soundTools.initMIDI)(setMidiValue);
  };

  var noiseScale = 0.02;
  var vertexBuffer = new Array(bins);

  var fillVertexBuffer = function fillVertexBuffer(newArray) {
    var len = vertexBuffer.length;
    var firstValue = vertexBuffer.shift();
    vertexBuffer[len - 1] = newArray;
    return firstValue || [];
  };

  var counter = function counter() {
    return sk.millis() / 1000;
  };

  var XY = function XY() {
    return Math.sin(sk.millis() / 100000) * 1000;
  };

  var drawLine = function drawLine(x1, x2, y) {
    var VERTS = 512;
    var dist = (x2 - x1) / VERTS;
    sk.beginShape(sk.TRIANGLE_STRIP); // const spectrum = getSpectrum(VERTS);

    var buffer0 = fillVertexBuffer(_toConsumableArray(new Array(VERTS)).map(function () {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var i = arguments.length > 1 ? arguments[1] : undefined;
      var noiseVal = sk.noise((XY() + i) * noiseScale, XY() * noiseScale) * 100;
      return y + noiseVal;
    }));

    _toConsumableArray(new Array(VERTS)).forEach(function () {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var i = arguments.length > 1 ? arguments[1] : undefined;
      // console.log(`vertex ${i}`, noiseVal);
      // sk.vertex(x1 + (i * dist), y + spectrum[i]);
      // sk.vertex(x1 + (i * dist), y + noiseVal * midiValue/10, 0);
      sk.vertex(x1 + i * dist, buffer0[i], 0);
    });

    sk.endShape();
  };

  var drawLines = function drawLines(x1, x2, y) {
    return _toConsumableArray(new Array(27)).forEach(function (v, i) {
      return drawLine(x1, x2, -sk.canvas.height / 2 + 20 * i);
    });
  };

  sk.draw = function () {
    sk.clear();
    sk.background('#c6c1b8'); // let spectrum = getSpectrum(512);
    // console.log(spectrum);
    // for every block of width 
    // canvas width / BLOCKS = width next
    // const BLOCKS = midiValue || 1;
    // const WIDTH = sk.canvas.width/BLOCKS;
    // for (let i = 0; i < BLOCKS; i++) {
    //   sk.push();
    //   sk.rotateX(counter() / (i/20 + 1));
    //   const x1 = -sk.canvas.width/2 + (WIDTH * i);
    //   const x2 =  x1 + WIDTH;
    //   drawLines(x1, x2);
    //   sk.pop();
    // }

    drawLines(-sk.canvas.width / 2 + 50, sk.canvas.width / 2 - 100);
  };
});