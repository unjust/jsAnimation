import p5 from 'p5';

new p5((sk) => {

  const DIM = 20;
  let th = DIM * 1.5;
  let tw = DIM * 2;
  let counter = 0;

  let th_delta = 0;

  sk.setup = () => {
    sk.createCanvas(500, 500);
  };

  sk.update = () => {
    counter += .05;
    th_delta = Math.sin(counter) * th;
  };

  sk.draw = () => {
    sk.background(200);
    sk.update();
    for (let x = 0; x < sk.windowWidth; x += tw) {
      for (let y = 0; y < sk.windowHeight; y += th) {
        sk.triangle(x, y, x + tw/2, y + th_delta, x + tw, y);
      }
    }
    // sk.triangle(0, 0, tw/2, th, tw, 0);
  };
});