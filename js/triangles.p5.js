import p5 from 'p5';
import DancingTriangle from './DancingTriangle.js';

new p5((sk) => {

  let objects = [];

  sk.setup = () => {
    sk.createCanvas(500, 500, sk.WEBGL);
    sk.createObjects();
  };

  sk.createObjects = function() {

    const DIM = 20;
    let th = DIM * 1.5;
    let tw = DIM * 2;

    for (let x = 0, objectCount = 0; x < sk.width + tw; x += tw, objectCount++) {
      for (let y = 0; y < sk.height + th; y += th) {
        objects.push(new DancingTriangle(x, y, tw, th, objectCount));
      }

      console.log(objectCount, " triangles created");
    }
  };

  sk.update = () => {};

  sk.keyPressed = () => {
    DancingTriangle.switchMotion();
  };

  sk.draw = () => {
    sk.background(200);
    
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);

    objects.forEach((triangle) => {
      triangle.update();
      triangle.draw(sk);
    });
  
    sk.pop();
  };
});