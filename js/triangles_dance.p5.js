import p5 from 'p5';
import DancingTriangle from 'Framework/DancingTriangle';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';
import { extendTouchEasycam } from 'Framework/mixins/touchEvents';

const containerEl = document.querySelector('#container');

const myp5 = new p5((sk) => {

  let scroll = 0;
  DancingTriangle.motionType = 0;

  const DIM = 20;
  let th = DIM * 1.5;
  let tw = DIM * 2;
  let triangles = [];
  let cam;

  sk.setup = () => {
    sk.createCanvas(containerEl.clientWidth, containerEl.clientHeight, sk.WEBGL);
    sk.createTriangles(2);
    cam = createEasyCam.bind(sk)();
    extendTouchEasycam(cam, {
      touchstart: () => {
        sk.keyPressed();
      }
    })
  };

  sk.windowResized = () => {
    sk.resizeCanvas(containerEl.clientWidth, containerEl.clientHeight); 
  }

  sk.createTriangles = function() {
    let i = 0;
    
    for (let x = 0; x < sk.windowWidth + tw; x += tw) {
      for (let y = 0; y < sk.windowHeight + th; y += th) {
        triangles.push(new DancingTriangle(x, y, tw, th, i));
        i++;
      }
    }
    console.info(`${i} triangles created, tap or hit keys to change motion :)`);
    console.info('navigate with press + hold of mouse, or touch + hold to view the plane from different perspectives.');
  };

  sk.keyPressed = () => {
    DancingTriangle.switchMotion();
  };

  sk.mousePressed = () => {
    scroll += 1;
    // scroll = sk.mouseY;
  };

  sk.draw = () => {
    sk.background(200);
    sk.fill(255);
    const startX = -sk.windowWidth/2;
    const startY = -sk.windowHeight/2;
    sk.push();
    sk.translate(startX, startY);
    triangles.forEach((t) => {
      t.update(null, .03);
      t.draw(sk);
    });
    sk.pop();
  };
}, containerEl);

window.sketches.push(myp5);
