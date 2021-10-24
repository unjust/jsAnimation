import p5 from 'p5';
import Lissajous from 'Framework/Lissajous';
import { handlesTouch } from 'Utils/featureTests.js';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

window.$p5 = new p5((sk) => {
  let liss, cam;

  // controls
  let diameter = 400,
      divisor1 = 16,
      divisor2 = 10,
      speed = 1,
      i = 1;
  
  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);

    liss = new Lissajous();
    liss.drawZ = true;
    liss.verticesTail = 400;
    liss.radius = diameter / 2;
    liss.xFactor = calculateXFactor(i, divisor1, divisor2); // 1 - cols (16)
    liss.yFactor = calculateYFactor(i, divisor1, divisor2); // 1 - 9 
    liss.zFactor = 1;
    liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
    liss.setColor('rgba(0, 255, 0, 0.25)');
    
    if (!handlesTouch) { // cam and touch conflict
      cam = createEasyCam.bind(sk)();
    }

    console.log('use x X to control factor');
    console.log('d D to change divisor, f F to change other divisor, z to toggle z drawing');
    console.log('number 123 is nice');
    console.log(`i ${i} divisor ${divisor1} divisor2 ${divisor2}`);
  }
  
  const calculateXFactor = (i, a, b) => (1 + (i % a)) / b;
  const calculateYFactor = (i, a, b) => (1 + Math.floor(i / a)) / b;
  
  sk.keyPressed = () => {
    if (sk.key == 'r' && cam) {
      cam.reset();
    }
   
    if (sk.key == 'x') {
      i--;
    } else if (sk.key == 'X') {
      i++;
    } 

    if (sk.key == 'd') {
      divisor1--;
    } else if (sk.key == 'D') {
      divisor1++;
    }
    
    if (sk.key == 'f') {
      divisor2--;
    } else if (sk.key == 'F') {
      divisor2++;
    }

    if (sk.key == 'z') {
      liss.drawZ = !liss.drawZ;
    }
    liss.xFactor = calculateXFactor(i, divisor1, divisor2); // 1 - cols (16)
    liss.yFactor = calculateYFactor(i, divisor1, divisor2); // 1 - 9 
    liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
    console.log(`i ${i} divisor ${divisor1} divisor2 ${divisor2}`);
  }

  sk.touchStarted = () => {
    sk.mousePressed();
  }

  sk.mousePressed = () => {
    if (!handlesTouch) {
      return;
    }
    if (sk.mouseX > sk.width/2) {
      i++;
    } else {
      i--;
    }

    liss.xFactor = calculateXFactor(i, divisor1, divisor2); // 1 - cols (16)
    liss.yFactor = calculateYFactor(i, divisor1, divisor2); // 1 - 9 
    liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
  
    console.log(`i ${i} divisor ${divisor1}`);
  }

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
  }

  sk.draw = () => {
    sk.background('black');
    sk.push();
    liss.draw(sk.LINES);
    sk.pop();
  }
}, document.querySelector('#container'));


