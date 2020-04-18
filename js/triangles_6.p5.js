import p5 from 'p5';
import DancingTriangle from 'Framework/DancingTriangle';

let scroll = 0;
DancingTriangle.motionType = 0;

new p5((sk) => {

  const DIM = 20;
  let th = DIM * 1.5;
  let tw = DIM * 2;
  let triangles = [];

  sk.setup = () => {
    sk.createCanvas(500, 500);
    sk.createTriangles(2);
  };

  sk.createTriangles = function() {
    let i = 0;

    for (let x = 0; x < sk.windowWidth + tw; x += tw) {
      for (let y = 0; y < sk.windowHeight + th; y += th) {
        triangles.push(new DancingTriangle(x, y, tw, th, i));
        i++;
      }
    }
    console.log(i, " triangles created");
  };

  sk.keyPressed = () => {
    DancingTriangle.switchMotion();
  };

  sk.mousePressed = () => {
    scroll += 1;
    // scroll = sk.mouseY;
  };

  sk.draw = () => {
    sk.background(200);

    triangles.forEach((t) => {
      t.update(null, .03);
      t.draw(sk);
    });
  };
});
