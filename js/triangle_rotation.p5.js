import p5 from 'p5';

const containerEl = document.querySelector('#container');

const myp5 = new p5((sk) => {

  const MOTION_TYPES = [ 'individual_rotate', 'rotate_y_axis' ];
  let motion_type_index = 0;
  const DIM = 20;

  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));

  let triangles = [];
  let rAxis;

  let zoom = false;
  let counter = 0;
  
  sk.setup = () => {
    rAxis = sk.createVector(0, 1, 0);
    sk.createCanvas(containerEl.clientWidth, containerEl.clientHeight, sk.WEBGL);
    sk.createTriangles();
  };

  sk.windowResized = () => {
    sk.resizeCanvas(containerEl.clientWidth, containerEl.clientHeight); 
  }

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
          y3: y
        });
        tri_count++;
      }
    }
    console.log(`${tri_count} triangles created!`);
  };

  sk.keyPressed = () => {
    if (sk.keyCode === sk.SHIFT) {
      zoom = true;
    }
    motion_type_index < MOTION_TYPES.length ? motion_type_index++ : motion_type_index = 0;
  };

  sk.keyReleased = () => {
    zoom = false;
  };

  sk.draw = () => {
    /* glitching because changing the animation
    if (sk.keyPressed()) {} 
    */
    if (sk.keyIsPressed && !zoom) {
      // don't clear
    } else if (zoom) {
      sk.clear();
      sk.translate(0, 0, sk.mouseY);
    }
    else {
      sk.clear();
      sk.background(100);
    }
    sk.translate(-sk.width/2, -sk.height/2, 0);

    const millis = sk.millis();

    // reactive with mouse
    if (motion_type_index === 0) {

      const gridSize = sk.width / tw;
      sk.push();
      triangles.forEach((t, i) => {
        const newRow = (i % gridSize === 0);
        if (i !== 0) {
          sk.translate((newRow) ? (-tw * (gridSize - 1)) : tw, newRow ? th : 0);
        } else {
          sk.translate(0, -th/2);
        }
        sk.push();

        sk.translate(tw/2, th);
        sk.rotateY(Math.sin(millis/3000 * (i * sk.mouseY/2000)));
        sk.beginShape(); 
        sk.vertex(-tw/2, -th/2);
        sk.vertex(0, th/2);
        sk.vertex(tw/2, -th/2);
        sk.endShape(sk.CLOSE);
        sk.pop();
      });

      sk.pop();
    } else {
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
    }
  };
}, containerEl);

window.sketches.push(myp5);
