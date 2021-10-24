import p5 from 'p5';
import Lissajous from 'Framework/Lissajous';
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

window.$p5 = new p5((sk) => {
  const diameter = 60;
  let cols, rows;
  let lissArray = [];
  let speed = 1;
  let cam;

  sk.setup = () => {
    sk.createCanvas(diameter * 16, diameter * 9, sk.WEBGL);
    cam = createEasyCam.bind(sk)();
    cols = Math.floor(sk.width / diameter),
    rows = Math.floor(sk.height / diameter)

    for (let i = 1; i <= cols * rows; i++) {
      const liss = new Lissajous();
      liss.id = i;
      liss.xFactor = (i % cols) + 1; // 1 - cols (16)
      liss.yFactor = Math.floor(i / cols) + 1; // 1 - 9 
      liss.zFactor = 1;
      liss.radius = diameter / 2;
      lissArray.push(liss);
      liss.setSpeed((speed + 1 * i) / 10); // (2 * i / 10)
      liss.setColor('rgba(0, 255, 0, 0.25)');
      
    }

    console.log('PANEL OF PRETTY LISSAJOUS');
    console.log('s and f for slower and faster, r camera reset');
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
      lissArray.forEach((l) => {
        l.setSpeed(++l.speed)
      });
    }
    else if (sk.key == 's') {
      lissArray.forEach((l) => {
        l.setSpeed(--l.speed)
      });
    }

  }

  sk.draw = () => {
    sk.background('black');
    sk.translate(-sk.width/2, -sk.height/2)
    sk.update();
    for (let i = 0, x = 0, y = 0; 
      i < cols * rows;
      x += diameter, i++
    ) 
    {
      if (i > 0 && i % cols == 0) {
        x = 0;
        y += diameter; // increase row
      }
      sk.push();
      sk.translate(x + diameter/2, y + diameter/2);
      lissArray[i].draw(sk.LINES);
      sk.pop();
    }
  }
}, document.querySelector('#container'));


