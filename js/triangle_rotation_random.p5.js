import p5 from 'p5';
import { createEasyCam } from 'Libraries/easycam/p5.easycam.js';

new p5((sk) => {

  const DIM = 20;
  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));

  let triangles = [];
  const indexesToDraw = [];
  let rAxis, indexes;

  // let counter = 0;
  
  sk.setup = () => {
    rAxis = sk.createVector(0, 1, 0);
    sk.createCanvas(800, 600, sk.WEBGL);
    sk.createTriangles();
    sk.pickTrianglesToDraw();
    createEasyCam.bind(sk)();
  };

  sk.createTriangles = function() {

    for (let x = 0; x < sk.width + tw; x += tw) {
      for (let y = 0; y < sk.height + th; y += th) {

        const triangle1 = {
          x1: x,
          y1: y,
          x2: x + tw/2,
          y2: y + th,
          x3: x + tw,
          y3: y,
          counter: 0,
          inMotion: false
        };

        const triangle2 = {
          x1: x + tw/2,
          y1: y + th,
          x2: x + tw,
          y2: y,
          x3: x + tw + tw/2,
          y3: y + th,
          counter: 0,
          inMotion: false
        };

        triangles.push(triangle1, triangle2)
      }
    }
    indexes = Array.from(Array(triangles.length).keys());
    console.log(`changing for workflow ${triangles.length} triangles created!`);
  };

  sk.pickTrianglesToDraw = () => {
    let triangleAmount = 15;
 
    while (triangleAmount > 0) {
      indexesToDraw.push(Math.floor(sk.random(0, triangles.length)));
      triangleAmount--;
    }

  }

  const toggleCursor = () => {
    document.body.className == "noCursor" ? 
      document.body.className = "" : document.body.className = "noCursor";
  }

  sk.keyPressed = () => {
    toggleCursor();  
  };

  sk.draw = () => {
    /* glitching because changing the animation
    if (sk.keyPressed()) {} 
    */
    
    // pick an index
    const triangleIndex = sk.random(indexes);
    indexes.splice(triangleIndex, 1);

    // store it
    // move the triangle

    sk.clear();
    sk.background(200);
    sk.fill(253, 246, 227);
    sk.translate(-sk.width/2, -sk.height/2, 0);

    // const millis = sk.millis();
    // counter += .001;

    // around axis
    const half_screen = sk.width/2;
    
    triangles.forEach((t, i) => {
      sk.stroke(253, 246, 227);
      
      if (indexes.length && i === triangleIndex) {
      // if (indexesToDraw.indexOf(i) !== -1) {
        t.inMotion = true;
      }
      if (t.inMotion) {
        t.counter += .001;
        sk.stroke(221, 214, 193);
      }

      sk.push();
      sk.beginShape();
      sk.translate(sk.width/2, 0);
      sk.rotate(t.counter * (i % 20), rAxis);
      sk.vertex(t.x1 - half_screen, t.y1);
      sk.vertex(t.x2 - half_screen, t.y2);
      sk.vertex(t.x3 - half_screen, t.y3);
      sk.endShape(sk.CLOSE);
      sk.pop();
    });
  };
}, 'container');

