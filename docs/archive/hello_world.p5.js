"use strict";

var _p = _interopRequireDefault(require("p5"));

require("p5/lib/addons/p5.sound");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// add *.p5.js as an extension and the p5 template
// without canvas
new _p["default"](function (sketch) {
  sketch.setup = function () {
    sketch.createCanvas(640, 480);
    console.log('hello world!!!'); // noCanvas();

    console.log(sketch.loadSound);
    var polysynth = new _p["default"].PolySynth();
    polysynth.play(53, 1, 0, 3);
    polysynth.play(60, 1, 0, 2.9);
    polysynth.play(69, 1, 0, 3);
    polysynth.play(71, 1, 0, 3);
    polysynth.play(74, 1, 0, 3);
    var midiNoteNumber = 70;
    var freq = sketch.midiToFreq(midiNoteNumber); // Convert MIDI note to frequency
    // Play note number 70 with velocity 1, starting now, for a duration of 1s

    polysynth.play(freq, 1.0, 0, 1);
  };

  sketch.draw = function () {
    if (sketch.mouseIsPressed) {
      sketch.fill(0);
    } else {
      sketch.fill(255);
    }

    sketch.ellipse(50, 50, 80, 80);
  };
});