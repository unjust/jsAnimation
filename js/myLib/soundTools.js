import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
// TODO use https://github.com/djipco/webmidi ??

let audio = null;
let fft = null;
let midiMessageCallback = () => {};

export const initAudioIn = (labelName="iShowU Audio Capture") => {
  audio = new p5.AudioIn((e) => console.log("error starting audio in"));
  audio.start();
  audio.getSources().
    then((sourceList) => { 
      // console.table(sourceList);
      const newSrcIndex = sourceList.findIndex((input) => input.label.includes(labelName));
      audio.setSource(newSrcIndex);
      setFFTInputSrc();
    });
  // console.log(audio.stream, audio.currentSource);
  return audio;
}

const setFFTInputSrc = (src=audio) => {
  // debugger
  fft.setInput(src); // or audio.currentSource
}

export const initFFT = (bins=1024, smoothing) => {
  fft = new p5.FFT(smoothing, bins);
}

export const getSpectrum = () => fft.analyze();

export function onMIDIMessage(e) {
  const message = e.data;
  // console.log(message, e);

  // [176, 5, 63]
  const command = message[0];
  const note = message[1];
  const velocity = message[2] || 0; 

  // https://www.smashingmagazine.com/2018/03/web-midi-api/
  // This array typically contains three values (e.g. [144, 72, 64]). 
  // The first value tells us what type of command was sent, the second is the note value, and the third is velocity. The command type could be either “note on,” “note off,” 
  midiMessageCallback(velocity, command, note);
  // console.log(velocity);
}

function onMIDISuccess(midiAccess) {
  const inputs = midiAccess.inputs;
  // const outputs = midiAccess.outputs;

  // for (var input of midiAccess.inputs.values())
  //  input.onmidimessage = getMIDIMessage;
  // }
  inputs.values().next().value.onmidimessage = onMIDIMessage;
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

export const initMIDI = (callback=()=>{}) => {
  midiMessageCallback = callback;
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);
}
