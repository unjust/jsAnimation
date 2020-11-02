"use strict";

var _p = _interopRequireDefault(require("p5"));

var _p5Easycam = require("Libraries/easycam/p5.easycam.js");

var _readParams = require("Utils/readParams");

var _soundTools = require("Framework/soundTools");

var _Lissajous = _interopRequireDefault(require("Framework/Lissajous"));

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

  var soundClip0, soundClip1;
  var bins = 1024;
  var VERTS = 20,
      LINES = 27;
  var randomBuffer;
  var animation = 0;
  var liss;
  var dim = 60;
  var animations = ["lines", "circles", "triangles"];
  var exportFrame = (0, _readParams.hasFrameParam)();
  var cam;

  sk.preload = function () {
    soundClip0 = sk.loadSound("img/faintalarmbug_edited.wav");
    soundClip1 = sk.loadSound("img/bleepyCricket_edited.wav");
  };

  sk.setup = function () {
    sk.pixelDensity(1);
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL); // sk.background('#c6c1b8');

    sk.background('#CCCCCC');
    sk.stroke('black');
    sk.strokeWeight(1);
    sk.noFill();
    (0, _soundTools.initAudioIn)();
    (0, _soundTools.initFFT)(bins); // initMIDI(setMidiValue);

    cam = _p5Easycam.createEasyCam.bind(sk)();
    liss = new _Lissajous["default"]();
    liss.verticeTail = 1000;
    liss.xFactor = 2;
    liss.yFactor = 2;
    liss.zFactor = 1;
    liss.rad = 0;
    liss.setSpeed(10);
    liss.setColor('rgba(0, 0, 0, 0.2)');
    randomBuffer = _toConsumableArray(new Array(VERTS * LINES)).map(function (v) {
      return sk.random(100);
    });
    soundClip0.onended(playSoundClip1);
    soundClip1.onended(playSoundClip0);
    playSoundClip0();
  };

  var playSoundClip0 = function playSoundClip0() {
    soundClip0.play();
    animation = 1;
  };

  var playSoundClip1 = function playSoundClip1() {
    soundClip1.play();
    animation = 0;
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
    return Math.sin(sk.millis() / 10000000) * 1000;
  };

  var drawLine = function drawLine(x1, x2, y, line) {
    var dist = (x2 - x1) / VERTS;
    sk.beginShape();
    var buffer0 = fillVertexBuffer(_toConsumableArray(new Array(VERTS)).map(function () {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var i = arguments.length > 1 ? arguments[1] : undefined;
      var noiseVal = sk.noise(XY() + i, XY()) * 100;
      var s = (0, _soundTools.getSpectrum)(512); // return y + noiseVal;

      return y + s[i];
    }));

    _toConsumableArray(new Array(VERTS)).forEach(function () {
      var v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var i = arguments.length > 1 ? arguments[1] : undefined;
      // console.log(`vertex ${i}`, noiseVal);
      // sk.vertex(x1 + (i * dist), y + spectrum[i]);
      // sk.vertex(x1 + (i * dist), y + noiseVal * midiValue/10, 0);
      sk.vertex(x1 + i * dist, buffer0[i], Math.sin(sk.millis() / 1000) * randomBuffer[i + line * VERTS]);
    });

    sk.endShape();
  };

  var drawLines = function drawLines(x1, x2, y) {
    return _toConsumableArray(new Array(LINES)).forEach(function (v, i) {
      drawLine(x1, x2, -sk.canvas.height / 2 + 20 * i, i);
    });
  };

  var drawCircles = function drawCircles() {};

  var saveFrame = function saveFrame() {
    if (!exportFrame || sk.frameCount < 100) {
      return;
    }

    sk.saveFrames('textureFrame', 'png', 1, 1);
    exportFrame = false;
  };

  sk.windowResized = function () {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  };

  sk.keyPressed = function () {
    if (sk.key.toLowerCase() === 'f') {
      sk.fullscreen();
    } // else if (sk.key === 's') {
    //   soundClip0.play();
    //   animation = 1;
    // }
    // else if (sk.key === 'S') {
    //   soundClip1.play();
    //   animation = 0;
    // }
    // else {
    //   (animation < animations.length - 1) ? animation++ : animation = 0;
    // }

  };

  sk.draw = function () {
    sk.clear();
    sk.background('#EEE'); // let spectrum = getSpectrum(512);
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

    switch (animations[animation]) {
      case "lines":
        drawLines(-sk.canvas.width / 2 + 50, sk.canvas.width / 2 - 100);
        break;

      case "circles":
        sk.push();
        sk.translate(0, 0);
        sk.rotateX(sk.millis() / 1000);
        liss.setData((0, _soundTools.getSpectrum)(VERTS)[100] || 0);
        liss.draw(sk);
        sk.pop();
        break;

      case "triangles":
      default:
        drawLines(-sk.canvas.width / 2 + 50, sk.canvas.width / 2 - 100);
        break;
    }

    ;
    saveFrame();
  };
});