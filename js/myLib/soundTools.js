import p5 from 'p5';
import 'p5/lib/addons/p5.sound';

let audio = null;
let fft = null;

export const initAudioIn = (labelName="iShowU Audio Capture") => {
  audio = new p5.AudioIn((e) => console.log("error starting audio in"));
  audio.start();
  audio.getSources().
    then((sourceList) => { 
      console.table(sourceList);
      const newSrcIndex = sourceList.findIndex((input) => input.label.includes(labelName));
      audio.setSource(newSrcIndex);
      setFFTInputSrc();
    });
  console.log(audio.stream, audio.currentSource);
  return audio;
}

const setFFTInputSrc = (src=audio) => {
  debugger
  fft.setInput(src); // or audio.currentSource
}

export const initFFT = (bins=1024, smoothing) => {
  fft = new p5.FFT(smoothing, bins);
}

export const getSpectrum = () => fft.analyze();
