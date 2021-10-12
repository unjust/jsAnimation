import p5 from 'p5';

new p5((sk) => {
  sk.setup = () => {
    sk.createCanvas(800, 800, sk.WEBGL);
  };

  sk.draw = () => {
    sk.push();
    sk.rotateX(100.0);
    sk.box(100);
    sk.pop();
  };
}, document.querySelector("#animation-container"));
