import p5 from 'p5';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";
import { hasFrameParam } from 'Utils/readParams';
import {  initFFT, getSpectrum, initAudioIn, initMIDI } from 'Framework/soundTools';
import Liss from 'Framework/Lissajous';

new p5((sk) => {

  let midiValue;
  const setMidiValue = (value) => midiValue = value;
  const bins = 1024;
  const VERTS = 20,
        LINES = 27;

  let randomBuffer;
  let animation = 0;
  let liss;
  const dim = 60;

  const animations = ["lines", "circles", "triangles"];

  let exportFrame = hasFrameParam();

  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);

    sk.background('#c6c1b8');
    sk.stroke('black') 
    sk.strokeWeight(1);
    sk.noFill();

    initAudioIn();
    initFFT(bins);
    initMIDI(setMidiValue);

    createEasyCam.bind(sk)();

    liss = new Liss();
    liss.verticeTail = 200;
    liss.xFactor = 9;
    liss.yFactor = 4;
    liss.zFactor = 10;
    liss.rad = dim/2;
    liss.setSpeed(10);
    
    randomBuffer = [...new Array(VERTS*LINES)].map(v => sk.random(100));
  };

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
    // const spectrum = getSpectrum(VERTS);

    const buffer0 = fillVertexBuffer([...new Array(VERTS)].map((v=0, i) => {
      let noiseVal = sk.noise((XY() + i), XY()) * 100;
      return y + noiseVal;
    }));

    [...new Array(VERTS)].forEach((v=0, i) => {
      // console.log(`vertex ${i}`, noiseVal);
      // sk.vertex(x1 + (i * dist), y + spectrum[i]);
      // sk.vertex(x1 + (i * dist), y + noiseVal * midiValue/10, 0);
      sk.vertex(x1 + (i * dist), buffer0[i], Math.sin(sk.millis()/1000) * randomBuffer[i + (line*VERTS)]);
    });
    sk.endShape();
  };

  const drawLines = (x1, x2, y) => [...new Array(LINES)].forEach((v, i) => drawLine(x1, x2, -sk.canvas.height/2 + 20 * i, i));

  const drawCircles = () => {

  }

  const saveFrame = () => {
    if (!exportFrame || sk.frameCount < 100) {
      return;
    }
    // sk.saveCanvas('textureFrame', 'png');
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
    (animation < animations.length - 1) ? animation++ : animation = 0;
  }

  sk.draw = () => {
    sk.clear();
    sk.background('#c6c1b8');
  
  
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
