import p5 from 'p5';

new p5((sk) => {

  let shape_type = 0;
  let shapeCount = 1;

  const DIM = 20;

  let tw = DIM * 2;
  let th = Math.sqrt((tw*tw) - (tw*tw/4));

  let clearBg = false;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    console.log('type s or r to render triangles or squares, hold down key to not clear bg');
  };


  sk.keyPressed = () => {
    shapeCount++;
    if (sk.key === 's') {
      shape_type = 0;
    } else if (sk.key === 't') {
      shape_type = 1;
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
        sk.translate(x, y);

        sk.beginShape();

        sk.rotateY(Math.cos(millis));
        
        sk.vertex(0, 0);
        sk.vertex(spacing, 0);
        sk.vertex(0, spacing);
        sk.endShape(sk.CLOSE);
        sk.pop();

      } else if (shape_type === 1) {
        sk.push();
        sk.translate(x, y);
        sk.beginShape();
        sk.rotateX(Math.sin(millis));
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

