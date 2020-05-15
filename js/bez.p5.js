import p5 from 'p5';
import { drawCoords } from 'Utils/coords.p5.js';

new p5((sk) => {
  let c = 0;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
  };

  sk.draw = () => {
    c += 1;
    let d = Math.cos(c/50) * 4;
    console.log(d);
    sk.background(255);
    sk.stroke(100);
    sk.noFill();
    drawCoords(sk);
    sk.beginShape();
    sk.vertex(-sk.width/2, 0);
    sk.bezierVertex(-sk.width/d, -100, sk.width/d, 100, sk.width/2, 0);
    // sk.vertex(sk.width/2, 0);
    sk.endShape();
  };
});
