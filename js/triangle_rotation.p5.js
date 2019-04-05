import p5 from 'p5';
import DancingTriangle from './DancingTriangle.js';

new p5((sk) => {
  let counter = 0;
  const DIM = 20;

  let th = DIM * 1.5;
  let tw = DIM * 2;

  let triangles = [];

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    sk.createTriangles();
  };

  sk.createTriangles = function() {
    let i = 0;

    for (let x = 0; x < sk.windowWidth + tw; x += tw) {
      for (let y = 0; y < sk.windowHeight + th; y += th) {
        triangles.push(new DancingTriangle(x, y, tw, th, i));
        i++;
      }
    }
    console.log(`${i} triangles created`);
  };

  sk.draw = () => {
    sk.clear();
    counter+=.1;
    // sk.translate(-sk.windowWidth/2, -sk.windowHeight/2, 0);

    sk.push();
    sk.beginShape();
    sk.rotateX(Math.sin(counter));
    sk.vertex(30, 20);
    sk.vertex(85, 20);
    sk.vertex(85, 75);
    sk.vertex(30, 75);
    sk.endShape(sk.CLOSE);
    sk.pop();

    sk.push();
    sk.translate(100, 0);
    sk.beginShape();
    sk.rotateY(Math.cos(counter));
    sk.vertex(30, 20);
    sk.vertex(85, 20);
    sk.vertex(30, 75);
    sk.endShape(sk.CLOSE);
    sk.pop();

    // triangles.forEach((t, i) => {
    //   t.update();
    //   //sk.push();
    //   t.draw(sk, Math.sin(counter + i));
    //   //sk.pop();
    // });
  };
});

