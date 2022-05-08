// import { accessMIDI } from "Utils/Midi.js"
import p5 from 'p5';
// import 'p5/lib/addons/p5.sound';

new p5((sk) => {

  let theShader;

  sk.preload = () => {
    theShader = sk.loadShader('shaders/lineDots.vert', 'shaders/lineDots.frag');
  }
  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
  };



  sk.draw = () => {
    theShader.setUniform('iTime', sk.frameCount/100);
    theShader.setUniform('iResolution', [sk.width, sk.height]);
    sk.shader(theShader);

    sk.rect(0,0,sk.width, sk.height);
  };

  sk.mousePressed = function() {
  }
}, document.querySelector('#container'));


