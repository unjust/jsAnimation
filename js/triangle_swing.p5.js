import p5 from 'p5';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {

  let shape_type = 0;
  let shapeCount = 1;

  let rotate = true;
  
  const DIM = 20;

  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));

  let clearBg = false;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    createEasyCam.bind(sk)();

    // console.log('type s or t to render triangles or squares, hold down key to not clear bg');
    console.log('type keys to add triangles, r to toggle swing, hold down key to not clear bg');
 
  };


  sk.keyPressed = () => {
    shapeCount++;
    // if (sk.key === 's') {
    //   shape_type = 1;
    // } else if (sk.key === 't') {
    //   shape_type = 0;
    if (sk.key === 'r') {
      rotate = !rotate;
    }
  };

  sk.keyReleased = () => {
    clearBg = false;
  };

  sk.draw = () => {
    /* glitching because changing the animation
    if (sk.keyPressed()) {

    } 
    */
    sk.fill(255);
    if (sk.keyIsPressed && !clearBg) {
      // don't clear
    } else if (clearBg) {
      sk.clear();
      sk.translate(0, 0, sk.mouseY);
    }
    else {
      sk.clear();
      sk.background(100);
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

      if (shape_type === 0) {

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

      } else if (shape_type === 1) {
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
      }
    }
  };
});

