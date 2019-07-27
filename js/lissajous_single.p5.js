import p5 from 'p5';
import Liss from 'Framework/Lissajous';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

class LissVert extends Liss {
  draw() {
    this.update();
    $p5.fill('rgba(0,255,0,0.25)');;
    $p5.stroke('rgba(0,255,0,0.25)');
    $p5.beginShape($p5.LINES);
    this.vertices.forEach((v) => {
      $p5.vertex(v.x, v.y, 1);
    });
    $p5.endShape();
  }
};

window.$p5 = new p5((sk) => {
  let dim = 60;
  let liss;
  // controls
  let speed = 1, 
      xFactor = 6, 
      yFactor = 2,
      height = 500;
  

  sk.setup = () => {
    sk.createCanvas(dim*16, dim*9, sk.WEBGL);

    liss = new LissVert();
    liss.id = 20;
    liss.verticeTail = 500;
    
    liss.xFactor = xFactor;
    liss.yFactor = yFactor;
    liss.zFactor = 1;
    liss.rad = 200;
    //const i = (xFactor - 1) * (yFactor - 1);
    liss.setSpeed((speed + 1 * 20)/10);
    let cam = createEasyCam.bind(sk)();
  }


  sk.update = () => {
    // liss.update();
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
    } else if (sk.key == 'y') {
      yFactor--;
    } if (sk.key == 'X') {
      xFactor++;
    } else if (sk.key == 'Y') {
      yFactor++;
    } else if (sk.key == 'H') {
      height += 10;
    } else if (sk.key == 'h') {
      height -= 10;
    } else if (sk.key == 'f') {
      speed += 10;
    } else if (sk.key == 's') {
      speed -= 10;
    }
  
    // const newSpeed = (speed + (1 * l.id))/1000;
    const newSpeed = liss.setSpeed((speed + 1 * (xFactor * yFactor))/1000);
    liss.setSpeed(newSpeed);
    liss.xFactor = xFactor;
    liss.yFactor = yFactor;
    liss.height = height;
  }

  sk.draw = () => {
    sk.background('black');
    sk.update();
  
    sk.push();
    sk.translate(-liss.rad/4, -liss.rad/4);
    liss.draw();
    sk.pop();
    
  }
});


