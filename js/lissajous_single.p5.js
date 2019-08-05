import p5 from 'p5';
import Lissajous from 'Framework/Lissajous';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

window.$p5 = new p5((sk) => {
  let liss, cam;

  // controls
  let xFactor = 1, 
      yFactor = 1,
      height,
      radius;
  
  let handlesTouch = false;

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);

    height = Math.min(sk.windowHeight/4, 400);
    radius = Math.min(sk.windowWidth/3, 200);

    liss = new Lissajous();
    liss.verticesTail = 300;
    liss.setColor('rgba(255, 0, 0, 0.25)');
    
    liss.xFactor = xFactor;
    liss.yFactor = yFactor;
    liss.zFactor = 1;
    liss.radius = radius;
    liss.setSpeed(1)

    handlesTouch = 'ontouchstart' in document.documentElement;

    if (!handlesTouch) { // cam and touch conflict
      cam = createEasyCam.bind(sk)();
    }

    console.log('centered lissajous form. use keys or touches to change it.');
    console.log('X x Y y H h to affect xFactor yFactor and height');
    console.log('f or s faster and slower');
  }

  sk.keyPressed = () => {
    if (sk.key == 'r') {
      cam.reset();
    }
    if (!(sk.key == 'x' 
      || sk.key == 'y' 
      || sk.key == 'X' 
      || sk.key == 'Y'
      || sk.key == 'h'
      || sk.key == 'H'
      || sk.key == 'f'
      || sk.key == 's')) {
      return;
    }

    if (sk.key == 'x') {
      xFactor--;
    } else if (sk.key == 'X') {
      xFactor++;
    } else if (sk.key == 'y') {
      yFactor--;
    } else if (sk.key == 'Y') {
      yFactor++;
    } else if (sk.key == 'h') {
      height -= 10;
    } else if (sk.key == 'H') {
      height += 10;
    } else if (sk.key == 'f') {
      liss.setSpeed(++liss.speed);
    } else if (sk.key == 's') {
      liss.setSpeed(--liss.speed);
    }
    
    liss.xFactor = xFactor;
    liss.yFactor = yFactor;
    liss.height = height;
    console.log(`xfactor ${xFactor} yfactor ${yFactor} height ${height}`);
  }

  sk.touchStarted = () => {
    sk.mousePressed();
  }

  sk.mouseWheel = (event) => {
    //move the square according to the vertical scroll amount
    liss.verticesTail += event.delta;
    console.log(liss.verticesTail);
  }

  sk.mousePressed = () => {
    if (!handlesTouch) {
      return;
    }
    if (sk.mouseX > sk.width/2) {
      liss.xFactor += 1;
    } else {
      liss.xFactor += 1;
    }
    if (sk.mouseY > sk.height/2) {
      liss.yFactor += 1;
    } else {
      liss.yFactor -= 1;
    }
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


