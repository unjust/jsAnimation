import p5 from 'p5';
import {  initFFT, getSpectrum, initAudioIn } from 'Framework/soundTools';

new p5((sk) => {
  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(1000, 500, sk.WEBGL);
    sk.background('#c6c1b8');
    // sk.stroke('black') 
    initAudioIn();
    
    initFFT(1024);
  };

  const counter = () => sk.millis() / 1000;
  const noiseScale = 0.02;

  const drawLine = (x1, x2, y) => {
    const VERTS = 512;
    const dist = (x2 - x1) / VERTS;
    sk.beginShape(sk.LINES);
    const spectrum = getSpectrum(VERTS);
    [...new Array(VERTS)].forEach((v=0, i) => {
      // console.log(`vertex ${i}`, noiseVal);
      let noiseVal = sk.noise((sk.mouseX + i) * noiseScale, sk.mouseY * noiseScale) * 100;
      sk.vertex(x1 + (i * dist), y + spectrum[i]);
    });
    sk.endShape();
  };

  const drawLines = (x1, x2, y) => [...new Array(1)].forEach((v, i) => drawLine(x1, x2, 20 * i));

  sk.draw = () => {
    sk.clear();
    sk.background('#c6c1b8');
    // let spectrum = getSpectrum(512);
    // console.log(spectrum);
    // for every block of width 
    // canvas width / BLOCKS = width next

    const BLOCKS = 2;
    const WIDTH = sk.canvas.width/BLOCKS;
    for (let i = 0; i < BLOCKS; i++) {
      sk.push();
      sk.rotateX(counter() / (i/20 + 1));
      sk.stroke(0);
      const x1 = -sk.canvas.width/2 + (WIDTH * i);
      const x2 =  x1 + WIDTH;
      drawLines(x1, x2);
      sk.pop();
    }
    // drawLines(-sk.canvas.width/2 + 50, sk.canvas.width/2 - 100);
  };
});
