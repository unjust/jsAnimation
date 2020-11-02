import p5 from 'p5';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";
import { hasFrameParam } from 'Utils/readParams';
import {  initFFT, getSpectrum, initAudioIn, initMIDI } from 'Framework/soundTools';
import Liss from 'Framework/Lissajous';

new p5((sk) => {

  let midiValue;
  const setMidiValue = (value) => midiValue = value;
  let soundClip0, soundClip1;
  const bins = 1024;
  const VERTS = 20,
        LINES = 27;

  let randomBuffer;
  let animation = 0;
  let liss;
  const dim = 60;

  const animations = ["lines", "circles", "triangles"];

  let exportFrame = hasFrameParam();
  let cam;

  sk.preload = function() {
    soundClip0 = sk.loadSound("img/faintalarmbug_edited.wav");
    soundClip1 = sk.loadSound("img/bleepyCricket_edited.wav");
  }

  
  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);

    // sk.background('#c6c1b8');
    sk.background('#CCCCCC');
    sk.stroke('black') 
    sk.strokeWeight(1);
    sk.noFill();


    initAudioIn();
    initFFT(bins);
    // initMIDI(setMidiValue);

    cam = createEasyCam.bind(sk)();

    liss = new Liss();
    liss.verticeTail = 1000;
    liss.xFactor = 2;
    liss.yFactor = 2;
    liss.zFactor = 1;
    liss.rad = 0;
    liss.setSpeed(10);
    liss.setColor('rgba(0, 0, 0, 0.2)');
    
    randomBuffer = [...new Array(VERTS*LINES)].map(v => sk.random(100));

    soundClip0.onended(playSoundClip1);
    soundClip1.onended(playSoundClip0);
    playSoundClip0();
    
  };

  const playSoundClip0 = () => {
    soundClip0.play();
    animation = 1;
  }

  const playSoundClip1 = () => {
    soundClip1.play();
    animation = 0;
  }

  const noiseScale = 0.02;
  const vertexBuffer = new Array(bins);

  const fillVertexBuffer = (newArray) => {
    const len = vertexBuffer.length;
    const firstValue = vertexBuffer.shift();
    vertexBuffer[len - 1] = newArray;
    return firstValue || [];
  } 

  const counter = () => sk.millis() / 1000;

  const XY = () => Math.sin( sk.millis() / 10000000 ) * 1000;

  const drawLine = (x1, x2, y, line) => {
    const dist = (x2 - x1) / VERTS;
    sk.beginShape();
    

    const buffer0 = fillVertexBuffer([...new Array(VERTS)].map((v=0, i) => {
      let noiseVal = sk.noise((XY() + i), XY()) * 100;
      const s = getSpectrum(512);
      // return y + noiseVal;
      return y + s[i];
    }));

    [...new Array(VERTS)].forEach((v=0, i) => {
      // console.log(`vertex ${i}`, noiseVal);
      // sk.vertex(x1 + (i * dist), y + spectrum[i]);
      // sk.vertex(x1 + (i * dist), y + noiseVal * midiValue/10, 0);
      
      sk.vertex(x1 + (i * dist), buffer0[i], Math.sin(sk.millis()/1000) * randomBuffer[i + (line*VERTS)]);
    });
    sk.endShape();
  };

  const drawLines = (x1, x2, y) => [...new Array(LINES)].forEach((v, i) => {
   
    drawLine(x1, x2, -sk.canvas.height/2 + 20 * i, i)
  });

  const drawCircles = () => {}

  const saveFrame = () => {
    if (!exportFrame || sk.frameCount < 100) {
      return;
    }
     sk.saveFrames('textureFrame', 'png', 1, 1);
    exportFrame = false;
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  }

  sk.keyPressed = () => {
    if (sk.key.toLowerCase() === 'f') {
      sk.fullscreen();
    }
    // else if (sk.key === 's') {
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
  }

  sk.draw = () => {
    sk.clear();
    sk.background('#EEE');
  
    // let spectrum = getSpectrum(512);
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
        case("lines"):
          drawLines(-sk.canvas.width/2 + 50, sk.canvas.width/2 - 100);
          break;
        case("circles"):   
          sk.push();
          sk.translate(0, 0);
          sk.rotateX(sk.millis()/1000);
          liss.setData(getSpectrum(VERTS)[100] || 0)
          liss.draw(sk);
          sk.pop();
          break;
        case("triangles"):
        default:
          drawLines(-sk.canvas.width/2 + 50, sk.canvas.width/2 - 100);
          break;
      };


      saveFrame();
    }
    
});
