
import { Rectangle, Shape } from 'paper';

const WINDOW_SIZE = 1024;
let HISTORY_MAX = 43; // 1 sec about 42 sets for 44k samplingFreq / window size
let BAND_SIZE, CHANNEL_COUNT;

const AudioDetect = {

  analyzer: null,
  timeDataArray: [],
  history: [],
  devices: [],
  checkDevices() {
    return window.navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log('media devices', devices, window.navigator.mediaDevices.getSupportedConstraints());
      this.devices = devices.filter((d) => d.kind === 'audioinput');
    });
  },

  init() {
    this.checkDevices().then(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/deviceId
      const iShowYouCaptureId = 5;
      const constraints =  { deviceId: { exact: this.devices[iShowYouCaptureId].deviceId } };
      window.navigator.mediaDevices.getUserMedia({ audio: constraints, video: false })
        .then((stream) => {
          const context = new (window.AudioContext || window.webkitAudioContext);
          const src = context.createMediaStreamSource(stream);
          const processor = context.createScriptProcessor(WINDOW_SIZE, 1, 1);

          this.analyzer = context.createAnalyser();
          src.connect(this.analyzer);
          this.analyzer.fftSize = WINDOW_SIZE * 2;
          this.analyzer.smoothingTimeConstant = 0.25;

          const bufferLength = this.analyzer.frequencyBinCount;
          this.timeDataArray = new Uint8Array(bufferLength); // should be size * 2
          this.freqDataArray = new Uint8Array(bufferLength);
          //processor.onaudioprocess = (e) => {};

          HISTORY_MAX = Math.floor(context.sampleRate / WINDOW_SIZE);
          BAND_SIZE = context.sampleRate / WINDOW_SIZE;
          CHANNEL_COUNT = this.analyzer.channelCount;

        });
      });
    return this;
  },

  updateAudio() {
    if (!this.analyzer) {
      return;
    }

    let audioArray = [];
    this.analyzer.getByteTimeDomainData(this.timeDataArray);
    this.analyzer.getByteFrequencyData(this.freqDataArray);

    if (this.history.length > HISTORY_MAX) {
      this.history.shift();
    }
    this.history.push(this.freqDataArray);

    for (let index = 0; index < this.size; index++) {
      const section = this.freqDataArray.length / this.size;
      const arr = dataArray.slice(index * section, index * section + section);
      const freqVolume = arr.reduce((total, v) => total + v);
      this.audioArray.push(freqVolume)
    }
    return audioArray;
  },

  // needs work
  beatDetect() {
    const val = this.freqDataArray[1] + this.freqDataArray[2];
    const timeFrames = this.history.length;

    let totalVolumeOverTime = 0;
    for (let t = 0; t < timeFrames; t++) {
      // To obtain the frequency of each element of the FFT result we only need
      // to calculate the frequency split (44100/1024 = 43) and multiply it by
      // the index of the data array. So the first component store the result 
      // for the range 0-43Hz, the second 43-86Hz, the third 86-129Hz

      totalVolumeOverTime += this.history[t][6] + this.history[t][17];
      // bass range of 60hz-130hz, in which we will found the kick drum, 
      // and a low midrange 301hz-750hz, where a snare drum
    }

    let average = totalVolumeOverTime / timeFrames;

    // let threshold = -15 * variance * 1.55;
    const beat = val > average * 1.5;
    return beat; // 1.5;
  },

  drawFFT(viewWidth, viewHeight) {
    if (!this.analyzer) {
      return;
    }
  
    if (!this.fftRects) {
      this.fftRects = [];
      const bufferLength = this.freqDataArray.length;
      const barWidth = viewWidth / bufferLength;
      for (let i = 0; i < bufferLength; i++) {
        this.fftRects.push(new Shape.Rectangle({
          point: [i * barWidth, viewHeight],
          size: [barWidth, 20],
          strokeColor: 'black'
        }));
      }
    }
  
    this.fftRects.forEach((r, i) => { 
      let v = this.freqDataArray[i] / 128.0;
      let h = v * viewHeight / 2;
      r.size.height = h;
    });
  },

  drawOscilloscope(viewWidth, viewHeight) {
    if (!this.analyzer) {
      return;
    }

    if (!this.fftRects) {
      this.oscRects = [];
      const bufferLength = this.timeDataArray.length;
      const barWidth = viewWidth / bufferLength;
      for (let i = 0; i < bufferLength; i++) {
        this.oscRects.push(new Shape.Rectangle({
          point: [i * barWidth, viewHeight],
          size: [barWidth, 20],
          strokeColor: 'black'
        }));
      }
    }
  
    this.oscRects.forEach((r, i) => { 
      let v = this.timeDataArray[i] / 128.0;
      let h = v * viewHeight / 2;
      r.size.height = h;
    });
  },

  getFrequencyData() {
    return this.freqDataArray;
  },

  getTimeData() {
    return this.timeDataArray;
  }
};

export default AudioDetect;

export const AudioDraw = {
  paper: {
    drawData: function(dataArray=[], viewWidth=100, viewHeight=100) {
      if (!dataArray.length) {
        return;
      }
      if (!this.rects) {
        this.rects = [];
        const bufferLength = dataArray.length;
        const barWidth = viewWidth / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
          const r = new Shape.Rectangle({
            point: [i * barWidth, viewHeight],
            size: [barWidth,20],
            strokeColor: 'black'
          })
          this.rects.push(r);
        }
      }
      this.rects.forEach((r, i) => { 
        let v = dataArray[i] / 128.0;
        let h = v * viewHeight / 2;
        r.size.height = h;
      });
    }
  },

  p5: {
    drawData: function(dataArray=[], viewWidth=100, viewHeight=100, sk) {
      if (!dataArray.length) {
        return [];
      }
      if (!this.rects) {
        this.rects = [];
        const bufferLength = dataArray.length;
        const barWidth = viewWidth / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
          const coords = sk.createVector(i * barWidth, viewHeight);
          const dims = sk.createVector(barWidth, 20);
          this.rects.push([coords, dims]);
        }
      }
      this.rects.forEach((r, i) => { 
        let v = dataArray[i] / 128.0;
        let h = v * viewHeight / 2;
        // console.log(dataArray[i], h);
        r[1].y = h;
      });
      return this.rects;
    }
  }
}
