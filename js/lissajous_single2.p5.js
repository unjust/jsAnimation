import p5 from 'p5';
import Lissajous from 'Framework/Lissajous';
import handlesTouch from 'Utils/featureTests.js';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

window.$p5 = new p5((sk) => {
  let liss, cam;

  // controls
  let diameter = 400,
      divisor = 16,
      speed = 1,
      i = 1;
  
  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);

    liss = new Lissajous();
    liss.verticesTail = 400;
    liss.radius = diameter / 2;
    liss.xFactor = (i % divisor) + 1; // 1 - cols (16)
    liss.yFactor = Math.floor(i / divisor) + 1; // 1 - 9 
    liss.zFactor = 1;
    liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
    liss.setColor('rgba(0, 255, 0, 0.25)');
    
    if (!handlesTouch) { // cam and touch conflict
      // cam = createEasyCam.bind(sk)();
    }

    console.log('use x X to control factor, d D to change divisor');
  }
  
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
      divisor--;
    } else if (sk.key == 'D') {
      divisor++;
    }
    
    liss.xFactor = (i % divisor) + 1; // 1 - cols (16)
    liss.yFactor = Math.floor(i / divisor) + 1; // 1 - 9 
    liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
    console.log(`i ${i} divisor ${divisor}`);
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

    liss.xFactor = (i % divisor) + 1; // 1 - cols (16)
    liss.yFactor = Math.floor(i / divisor) + 1; // 1 - 9 
    liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
    console.log(`i ${i} divisor ${divisor}`);
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
});


