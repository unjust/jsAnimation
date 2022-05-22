import { accessMIDI } from "Utils/Midi.js"
import p5 from 'p5';
import 'p5/lib/addons/p5.sound';


new p5((sk) => {

  let osc, env, midiVal, mkey;
  let mute = false;
  let theShader;

  sk.preload = () => {
    theShader = sk.loadShader('shaders/color.vert', 'shaders/color.frag');
  }
  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    console.log('hey sound defined?', sk.midiToFreq);
    accessMIDI(onMidi);
    console.log(sk);
    osc = new p5.TriOsc();
    env = new p5.Envelope();
  };

  const onMidi = function(msg) {
    const [ type, key, velocity ] = msg.data;
    
    if (!key) {
      return;
    }
    // const [ type, key, velocity ] = msg.data;
    // console.log(msg.data)
    // https://code.tutsplus.com/tutorials/introduction-to-web-midi--cms-25220
    // 144 is note on
    // 176 - 191 is control change https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
    if (type !== 185) {
      console.log(type, key, velocity);
    }
    theShader.setUniform('midiKey', key);

    if (mute) {
      return;
    }
    const freq = sk.midiToFreq(key);
    mkey = key;
    console.log(`freq is ${freq} and key is ${key}`);
    osc.start();
    osc.freq(freq);
    env.ramp(osc, 0, 1.0, 0);
  
    
  }

  sk.keyPressed = () => {
    mute = !mute;
  }

  sk.draw = () => {
    sk.shader(theShader);

    sk.rect(0,0,sk.width, sk.height);
  };

  sk.mousePressed = function() {
    console.log("Starting");
    sk.userStartAudio();
  }
}, document.querySelector('#container'));


