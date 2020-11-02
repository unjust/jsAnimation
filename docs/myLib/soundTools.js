"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMIDIMessage = onMIDIMessage;
exports.initMIDI = exports.getSpectrum = exports.initFFT = exports.initAudioIn = void 0;

var _p = _interopRequireDefault(require("p5"));

require("p5/lib/addons/p5.sound");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// TODO use https://github.com/djipco/webmidi ??
var audio = null;
var fft = null;

var midiMessageCallback = function midiMessageCallback() {};

var initAudioIn = function initAudioIn() {
  var labelName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "iShowU Audio Capture";
  audio = new _p["default"].AudioIn(function (e) {
    return console.log("error starting audio in");
  });
  audio.start(); // audio.getSources().
  //   then((sourceList) => { 
  //     console.table(sourceList);
  //     const newSrcIndex = sourceList.findIndex((input) => input.label.includes(labelName));
  //     audio.setSource(newSrcIndex);
  //     setFFTInputSrc();
  //   });
  // audio.connect();
  // console.log(audio.stream, audio.currentSource);

  return audio;
};

exports.initAudioIn = initAudioIn;

var setFFTInputSrc = function setFFTInputSrc() {
  var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : audio;
  // debugger
  console.log(src);
  fft.setInput(src); // or audio.currentSource
};

var initFFT = function initFFT() {
  var bins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1024;
  var smoothing = arguments.length > 1 ? arguments[1] : undefined;
  fft = new _p["default"].FFT(smoothing, bins);
};

exports.initFFT = initFFT;

var getSpectrum = function getSpectrum() {
  return fft.analyze();
};

exports.getSpectrum = getSpectrum;

function onMIDIMessage(e) {
  var message = e.data; // console.log(message, e);
  // [176, 5, 63]

  var command = message[0];
  var note = message[1];
  var velocity = message[2] || 0; // https://www.smashingmagazine.com/2018/03/web-midi-api/
  // This array typically contains three values (e.g. [144, 72, 64]). 
  // The first value tells us what type of command was sent, the second is the note value, and the third is velocity. The command type could be either “note on,” “note off,” 

  midiMessageCallback(velocity, command, note); // console.log(velocity);
}

function onMIDISuccess(midiAccess) {
  var inputs = midiAccess.inputs;

  if (inputs.size === 0) {
    return;
  } // const outputs = midiAccess.outputs;
  // for (var input of midiAccess.inputs.values())
  //  input.onmidimessage = getMIDIMessage;
  // }


  inputs.values().next().value.onmidimessage = onMIDIMessage;
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

var initMIDI = function initMIDI() {
  var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
  midiMessageCallback = callback;
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
};

exports.initMIDI = initMIDI;