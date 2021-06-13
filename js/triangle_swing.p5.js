import p5 from 'p5';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';
import { extendTouchEasycam } from 'Framework/mixins/touchEvents';

const containerEl = document.querySelector('#container');

const myp5 = new p5((sk) => {

  const shapes = {
    TRIANGLE: 0,
    SQUARE: 1,
  };

  let shape_type = shapes.TRIANGLE;
  let shapeCount = 1;
  let rotate = true;
  
  const DIM = 20;

  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));

  let easycam;

  const backgroundColor = 100;
  const fillColor = 255;

  sk.setup = () => {
    sk.createCanvas(containerEl.clientWidth, containerEl.clientHeight, sk.WEBGL);
    easycam = createEasyCam.bind(sk)();
    extendTouchEasycam(easycam, {
      dbltap: (e) => {
        sk.keyPressed(e);
        sk.keyIsPressed = !sk.keyIsPressed;
      },
      // touchmoveMulti: (e) => {
      //   sk.keyIsPressed = true;
      // }
    })

    console.info('type keys or tap your finger to add triangles');
    console.info('hold down key or touch while moving to paint');
  };

  sk.windowResized = () => {
    sk.resizeCanvas(containerEl.clientWidth, containerEl.clientHeight); 
  }

  sk.keyPressed = () => {
    shapeCount++;
    // if (sk.key === 's') {
    //   shape_type = shapes.SQUARE;
    // } else if (sk.key === 't') {
    //   shape_type = shapes.TRIANGLE;
    if (sk.key === 'r') {
      rotate = !rotate;
    }
  };

  // sk.keyReleased = () => {
  //   clearBg = false;
  // };

  sk.draw = () => {
    /* glitching because changing the animation
    if (sk.keyPressed()) {} 
    */
    sk.fill(fillColor);
    if (!sk.keyIsPressed) {
      sk.clear();
      sk.background(backgroundColor);
    }

    // upper_left corner
    sk.translate(-sk.width/2, -sk.height/2, 0);

    const millis = sk.millis() / 300;

    const sq_dims = 55;
    const spacing = sq_dims + 10;

    const gridX = Math.floor(sk.width / spacing);
    const gridY = Math.floor(sk.height / spacing);
        
    for (var s = 0; s < shapeCount; s++) {

      const x = (s % gridX === 0) ? 0 :  (s % gridX) * spacing;
      const y = Math.floor(s / gridY) * spacing;

      // if (shape_type === shapes.TRIANGLE) {
        sk.push();
        sk.translate(x + spacing/2, y);
        if (rotate) {
          sk.rotateY(Math.cos(millis) * 2);
        }
        sk.beginShape();
        
        sk.vertex(-spacing/2, 0);
        sk.vertex(0, spacing);
        sk.vertex(spacing/2, 0);
        sk.endShape(sk.CLOSE);
        sk.pop();
      /* } else if (shape_type === shapes.SQUARE) {
        sk.push();
        sk.translate(x, y);
        sk.beginShape();
        if (rotate) {
          sk.rotateX(Math.sin(millis));
        }
        sk.vertex(30, 20);
        sk.vertex(85, 20);
        sk.vertex(85, 75);
        sk.vertex(30, 75);
        sk.endShape(sk.CLOSE);
        sk.pop();
      } */
    }
  };
}, containerEl);

window.sketches.push(myp5);
