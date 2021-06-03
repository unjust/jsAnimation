import p5 from 'p5';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {

  const MOTION_TYPES = [ 'individual_rotate', 'rotate_y_axis' ];
  let motion_type_index = 0;
  const DIM = 20;

  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));

  let triangles = [];
  let rAxis;

  let zoom = false;
  let counter = 0;
  
  const containerEl = document.querySelector('#container');

  sk.setup = () => {
    rAxis = sk.createVector(0, 1, 0);
    sk.createCanvas(containerEl.clientWidth, containerEl.clientHeight, sk.WEBGL);
    sk.createTriangles();
    createEasyCam.bind(sk)();
  };

  sk.createTriangles = function() {
    let tri_count = 0;

    for (let x = 0; x < sk.width + tw; x += tw) {
      for (let y = 0; y < sk.height + th; y += th) {
        triangles.push({
          x1: x,
          y1: y,
          x2: x + tw/2,
          y2: y + th,
          x3: x + tw,
          y3: y,
          counter: 0,
          inMotion: false
        });
        triangles.push({
          x1: x + tw/2,
          y1: y + th,
          x2: x + tw,
          y2: y,
          x3: x + tw + tw/2,
          y3: y + th,
          counter: 0,
          inMotion: false
        });
        tri_count+=2;
      }
    }
    console.log(`${tri_count} triangles created!`);
  };

  sk.keyPressed = () => {
    motion_type_index < MOTION_TYPES.length ? motion_type_index++ : motion_type_index = 0;
    document.body.className == "noCursor" ? document.body.className = "" : document.body.className = "noCursor";
  };

  sk.draw = () => {
    /* glitching because changing the animation
    if (sk.keyPressed()) {} 
    */
   
    sk.clear();
    sk.background(0);
    sk.fill(0);
    sk.stroke(100);
    sk.translate(-sk.width/2, -sk.height/2, 0);

    const millis = sk.millis();
    counter += .001;

    // around axis
    const half_screen = sk.width/2;
    triangles.forEach((t, i) => {
      sk.push();
      sk.beginShape();
      sk.translate(sk.width/2, 0);
      sk.rotate(counter * (i % 20), rAxis);
      sk.vertex(t.x1 - half_screen, t.y1);
      sk.vertex(t.x2 - half_screen, t.y2);
      sk.vertex(t.x3 - half_screen, t.y3);
      sk.endShape(sk.CLOSE);
      sk.pop();
    });
  };
}, 'container');

