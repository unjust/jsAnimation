import p5 from 'p5';
import Lissajous from 'Framework/Lissajous';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";


Math.fmod = (a,b) => Number((a - (Math.floor(a / b) * b)).toPrecision(8));

class Liss3D extends Lissajous {
  height = 500;

  update() {
    this.angle += this.speed;
    const nPoints = this.verticesTail;

    for (let point = 1; point < nPoints; point++) {
      let pointRatio = point/nPoints;
      let radPosition = 360 * pointRatio * $p5.PI/180;
      
      let lissX = Math.cos(radPosition * this.xFactor) * this.radius;
      let lissY = Math.sin(radPosition * this.yFactor) * this.radius + (this.height * pointRatio * this.angle);
      lissY = Math.fmod(lissY, this.height);
      let lissZ = (Math.sin(radPosition * this.xFactor * this.yFactor) * this.radius);
      
      if (this.vertices.length > this.verticesTail) {
        this.vertices.shift();
      }
      this.vertices.push({ x: lissX, y: lissY, z: lissZ });
    }
  }

  draw() {
    this.update();
    $p5.fill('rgba(0,255,0,0.25)');;
    $p5.stroke('rgba(0,255,0,0.25)');
    
    $p5.beginShape($p5.POINTS);
    this.vertices.forEach((v, i) => {
      $p5.vertex(v.x, v.y, v.z);
    });
    $p5.endShape();
  }
};

window.$p5 = new p5((sk) => {
  let dim = 60;
  let cols, rows;
  let lissArray = [];
  
  // controls
  let speed = 1, 
      xFactor = 1, 
      yFactor = 1,
      height = 500;
  let cam;

  sk.setup = () => {
    sk.createCanvas(dim * 16, dim * 9, sk.WEBGL);
    cam = createEasyCam.bind(sk)();
    cols = 1;
    rows = 1;
    dim = 500;
    
    for (let i = 0, rowNum = 0; i < cols * rows; i++){
      const liss = new Liss3D();
      liss.id = i;
      liss.xFactor = i % cols + 1;
      liss.yFactor = Math.floor(i / cols) + 1;
      liss.zFactor = 1;
      liss.verticesTail = 1000;
      liss.radius = dim/2;
      liss.height = dim;
      lissArray.push(liss);
      liss.setSpeed((speed + 1 * i)/10);
    }

    console.log('attempt at a 3D lissajous :-|');
    console.log('use x X to control factor, y Y to control Y factor');
    console.log('h H to control height, s and f for slower and faster');
    
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
    lissArray.forEach((l) => {
      const newSpeed = (speed + (1 * l.id))/1000;
      //l.setSpeed(newSpeed);
      l.xFactor = xFactor;
      l.yFactor = yFactor;
      l.height = height;
      // l.verticeTail += Math.max(xFactor, yFactor) * 2;
    });
  }

  sk.draw = () => {
    sk.background('black');
    
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
      sk.translate(x, y - lissArray[i].height/2);
      lissArray[i].draw();
      sk.pop();
    }
  }
}, document.querySelector('#container'));


