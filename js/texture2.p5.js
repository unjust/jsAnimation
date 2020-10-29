import p5 from 'p5';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";
import {  initFFT, getSpectrum, initAudioIn, initMIDI } from 'Framework/soundTools';


new p5((sk) => {

  let midiValue;
  const setMidiValue = (value) => midiValue = value;
  let cam;
  const bins = 1024;
  const VERTS = 20,
    LINES = 27;
  let randomBuffer;

  const animations = ["lines", "circles", "triangles"];
  let animation = 0;

  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(1000, 500, sk.WEBGL);
    sk.background('#c6c1b8');
    sk.stroke('black') 
    sk.strokeWeight(1);
    sk.noFill();
    initAudioIn();
    initFFT(bins);
    initMIDI(setMidiValue);
    cam = createEasyCam.bind(sk)();

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
  const XY = () => Math.sin(sk.millis() / 10000000)*1000;

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

  sk.keyPressed = () => {
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
        case("triangles"):
        default:
          drawLines(-sk.canvas.width/2 + 50, sk.canvas.width/2 - 100);
          break;
      };
    }
    
});
