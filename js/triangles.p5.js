import p5 from 'p5';
import DancingTriangle from 'Framework/DancingTriangle.js';

new p5((sk) => {

  let objects = [];
  const MILLIS_SCALER = 2;

  sk.setup = () => {
    sk.createCanvas(500, 500, sk.WEBGL);
    sk.createObjects();
    console.info("Dancing triangles. Press any key to change the motion.")
  };

  sk.createObjects = function() {
    const DIM = 20;
    let th = DIM * 1.5;
    let tw = DIM * 2;
    let objectCount = 0;

    for (let x = 0; x < sk.width + tw; x += tw, objectCount++) {
      for (let y = 0; y < sk.height + th; y += th) {
        objects.push(new DancingTriangle(x, y, tw, th, objectCount));
      }
    }
    console.log(`${objectCount} triangles created`);
  };

  sk.update = () => {};

  sk.keyPressed = () => {
    if (sk.key === 'm') {
      DancingTriangle.shouldMove = !DancingTriangle.shouldMove;
    } else {
      DancingTriangle.switchMotion();
    }
  };

  

  sk.draw = () => {
    sk.background(200);
    
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);

    const m = sk.millis() / MILLIS_SCALER;
    
    objects.forEach((triangle) => {
      //console.log(m, m2);
      triangle.update(m);
      triangle.draw(sk);
    });
  
    sk.pop();
  };
});
