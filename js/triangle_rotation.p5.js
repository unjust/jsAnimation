import p5 from 'p5';

new p5((sk) => {

  let motion = 0;

  let counter = 0;
  const DIM = 20;

  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));
  

  let triangles = [];

  let rAxis;

  let zoom = false;

  sk.setup = () => {

    rAxis = sk.createVector(0, 1, 0);
    sk.createCanvas(400, 400, sk.WEBGL);
    sk.createTriangles();
  };

  sk.createTriangles = function() {
    let i = 0;

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
        i++;
      }
    }
    console.log(`${i} triangles created!`);
  };

  sk.keyPressed = () => {
    if (sk.key === 'm') {
      //
    } else if (sk.keyCode === sk.SHIFT) {
      zoom = true;
    }
    (motion < 5) ? motion++ : motion = 0;
  };

  sk.keyReleased = () => {
    zoom = false;
  };

  sk.draw = () => {
    /* glitching because changing the animation
    if (sk.keyPressed()) {

    } 
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

    counter += .1;
    sk.translate(-sk.width/2, -sk.height/2, 0);

    const millis = sk.millis();

    if (motion === 2) {
      sk.push();
      sk.beginShape();
      sk.rotateX(Math.sin(counter));
      sk.vertex(30, 20);
      sk.vertex(85, 20);
      sk.vertex(85, 75);
      sk.vertex(30, 75);
      sk.endShape(sk.CLOSE);
      sk.pop();
    } else if (motion === 1) {
      sk.push();
      sk.translate(100, 0);
      sk.beginShape();
      sk.rotateY(Math.cos(counter));
      sk.vertex(30, 20);
      sk.vertex(85, 20);
      sk.vertex(30, 75);
      sk.endShape(sk.CLOSE);
      sk.pop();
    } else if (motion === 0) {
      const gridSize = 10;

      sk.push();

      triangles.forEach((t, i) => {
        
        // sk.translate((i === 0) ? 0 : ((tw % gridSize) * i), (th % gridSize) * th);
        const newRow = (i % gridSize === 0);
        if (i !== 0) {
          sk.translate((newRow) ? (-tw * (gridSize - 1)) : tw, newRow ? th : 0);
        } else {
          sk.translate(0, -th/2);
        }
        sk.push();

        sk.translate(tw/2, th);
        sk.rotateY(Math.sin(millis/3000 * (i * sk.mouseY/2000)));
      
        // debug
        // sk.rectMode(sk.CENTER);
        // sk.rect(0, 0, 4, 4);
        
        sk.beginShape(); 
        sk.vertex(-tw/2, th/2);
        sk.vertex(0, -th/2);
        sk.vertex(tw/2, th/2);
        sk.endShape(sk.CLOSE);

        sk.pop();
      });

      sk.pop();
    } else {
      triangles.forEach((t, i) => {
        sk.push();
        sk.beginShape();
        sk.translate(sk.width/2, 0);
        sk.rotate(sk.millis()/20000 * (i % 20), rAxis);
        sk.vertex(t.x1, t.y1);
        sk.vertex(t.x2, t.y2);
        sk.vertex(t.x3, t.y3);
        sk.endShape(sk.CLOSE);
        sk.pop();
      });
    }
  };
});

