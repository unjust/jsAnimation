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
  let cols, rows;
  let lissArray = [];
  let speed = 1;
  let cam;

  sk.setup = () => {
    sk.createCanvas(dim*16, dim*9, sk.WEBGL);
    cam = createEasyCam.bind(sk)();
    cols = Math.floor(sk.width / dim),
    rows = Math.floor(sk.height / dim)

    
    for (let i = 0; i < cols * rows; i++){
      const liss = new LissVert();
      liss.id = i;
      liss.xFactor = i % cols + 1;
      liss.yFactor = Math.floor(i / cols) + 1;
      liss.zFactor = 1;
      liss.rad = dim/2;
      lissArray.push(liss);
      liss.setSpeed((speed + 1 * i)/10);
    }
  }


  sk.update = () => {
    // liss.update();
  }

  sk.keyPressed = () => {
    if (sk.key == 'r') {
      cam.reset();
    }
    if (!(sk.key == 'f' || sk.key == 's')) {
      return;
    }
    if (sk.key == 'f') {
      speed += 10;
    }
    else if (sk.key == 's') {
      speed -= 10;
    }
    lissArray.forEach((l) => {
      const newSpeed = (speed + (1 * l.id))/1000;
      l.setSpeed(newSpeed)
    });
  }

  sk.draw = () => {
    sk.background('black');
    sk.translate(-sk.width/2, -sk.height/2)
    sk.update();
    for (let i = 0,
      x = 0,
      y = 0; 
      i < cols * rows;
      x += dim,
      i++) 
    {
      if (i > 0 && i % cols == 0) {
        x = 0;
        y += dim;
      }
      sk.push();
      sk.translate(x + dim/2, y + dim/2);
      lissArray[i].draw();
      sk.pop();
    }
  }
});


