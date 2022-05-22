// https://www.youtube.com/watch?v=5lIl5F1hpTE&ab_channel=TheCodingTrain

import p5 from 'p5';
import { accessMIDI } from "Utils/Midi.js"
import 'p5/lib/addons/p5.sound';

new p5((sk) => {

  let theShader,
    xFactor = 2.0,
    yFactor = 2.0,
    speed = 0.1;

  sk.preload = () => {
    theShader = sk.loadShader('shaders/liss.vert', 'shaders/liss.frag');
  }

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    sk.pixelDensity(1);
    accessMIDI(onMidi);
  };

  sk.keyTyped = () => {
    switch(sk.key) {
      case('x'):
        xFactor -= 1.0;
        break;
      case('X'):
        xFactor += 1.0;
        break;
      case('y'):
        xFactor -= 1.0;
        break;
      case('Y'):
        xFactor += 1.0;
        break;
      case 'f':
        speed += 0.1;
        break;
      case 's':
        speed -= 0.1;
        break;
    }
  }

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

    console.log('midi: ', type, key, velocity);
   
    if (key % 3 === 0) {
      xFactor = velocity/3.0;
    } else if (key % 2 === 0) {
      yFactor = velocity/2.0;
    } else {
      speed = velocity/100.0;
    }
    console.log(`xfactor ${xFactor} yfactor ${yFactor} s ${speed}`);
  }

  sk.draw = () => {
    // console.log("reso, ", [sk.width, sk.height])
    theShader.setUniform('u_resolution', [sk.width, sk.height]);
    theShader.setUniform('u_radius', 0.5);
    theShader.setUniform('u_time', sk.frameCount * 0.01);
    theShader.setUniform('u_speed', speed);
    theShader.setUniform('u_xy_factor', [xFactor, yFactor]);
    sk.shader(theShader);
    sk.rect(0,0, sk.width, sk.height);
  };
}, document.querySelector('#container'));


