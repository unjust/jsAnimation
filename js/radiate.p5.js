import p5 from 'p5';
import { createEasyCam, EasyCamLib } from '../libs/easycam/p5.easycam.js';


let CIRCLES_COUNT = 20;
let RADIUS = 20;
const SPHERE_SIZE = 20;

let isRecording = false;
let sequenceBuffer = [];
let timer_start, sequenceStepsTotal;


new p5((sk) => {
  sk.cam = null;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    RADIUS = (sk.width / 2) - 10;
    console.log('circles that move in clockwise, highlighting with a beat. can move the 3d plane');
    
    // const lib = EasyCamLib;
    // let x = new EasyCamLib.DampedAction();
    // console.log(lib);

    sk.cam = createEasyCam.bind(sk)();
  };

  const initRecording = () => {
    isRecording = true;
    sequenceBuffer = [];
  }

  const stopRecording = () => {
    isRecording = false;
    // process the buffer

    const initTime = sequenceBuffer[0];
    sequenceStepsTotal = sequenceBuffer.length;
    sequenceBuffer = sequenceBuffer.map((val, i) => (i === 0) ? 0 : val - initTime);
    console.log(sequenceBuffer);  
  }

  sk.keyPressed = () => {
    if (sk.keyCode === sk.SHIFT) {
      initRecording();
      return;
    }
  
    if (isRecording) {
      console.log('beat');
      sequenceBuffer.push(sk.millis());
    }
  };

  sk.keyReleased = () => {
    if (sk.keyCode === sk.SHIFT) {
      stopRecording();
    }
  };

  const drawAxes = () => {
    sk.strokeWeight(4);
    sk.stroke(255, 204, 0);
    sk.line(0, -sk.height, 0, sk.height);
    sk.line(-sk.width, 0, sk.width, 0);
  }

  sk.draw = () => {

    let willDrawBeat = false;

    if (sequenceBuffer.length && !isRecording) {
  
      if (sequenceBuffer.length === sequenceStepsTotal) {
        console.log('set timer start');
        timer_start = sk.millis();
      }
    
      let timeLapsed = sk.millis() - timer_start - sequenceBuffer[0];
      
      console.log(`${timeLapsed} = ${sk.millis()} - ${timer_start} - ${sequenceBuffer[0]}`);
      if (timeLapsed > 0 && timeLapsed <= 100) {
        willDrawBeat = true;
        sequenceBuffer.shift();
      }
    }
   
    sk.clear(); 
    sk.background(255);
    sk.fill(100);

    drawAxes();
    sk.noStroke();

    const rotation = sk.millis() / 1000;
    // console.log(rotation);
    sk.rotateZ(rotation);

    // if (!willDrawBeat) {
      // sk.fill(255, 0, 0);
    //} else { 
    //}

    for (let i = 1; i <= CIRCLES_COUNT; i++) {
      const pos = (sk.TWO_PI * i) / CIRCLES_COUNT;
      const x = Math.sin(pos);
      const y =  Math.cos(pos);
      let rad = Math.atan2(y, x);
      const fullCircle = (rotation + rad) % sk.TWO_PI;
      
      let dist = RADIUS;
      if (willDrawBeat) {
        dist = RADIUS + 5;
      }
      if (fullCircle >= 0 && fullCircle < .1) {
        sk.fill(0, 0, 255);
      } else {
        sk.fill(255, 0, 0);
      }
      sk.push();
      sk.translate(dist * x, dist * y, 0);
      sk.sphere(SPHERE_SIZE);
      sk.pop();
    }
  };
});