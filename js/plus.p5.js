import p5 from 'p5';

new p5((sk) => {
  const center = sk.createVector(0, 0);
  const radius = 40;
  let counter = 0;
  let thickness = 4;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
  };

  const drawCross = (x, y, r, t) => {
    let vectorArray = [
      sk.createVector(x - t/2 - r, y + t/2),
      sk.createVector(x - t/2, y + t/2),
      sk.createVector(x - t/2, y + t/2 + r),
      sk.createVector(x + t/2, y + t/2 + r),
      sk.createVector(x + t/2, y + t/2),
      sk.createVector(x + t/2 + r, y + t/2),
      sk.createVector(x + t/2 + r, y - t/2),
      sk.createVector(x + t/2, y - t/2),
      sk.createVector(x + t/2, y - t/2 - r),
      sk.createVector(x - t/2, y - t/2 - r),
      sk.createVector(x - t/2, y - t/2),
      sk.createVector(x - t/2 - r, y - t/2)
    ];

    sk.beginShape();
    vectorArray.forEach((v) => sk.vertex(v.x, v.y));
    sk.endShape();
  }

  sk.draw = () => {
    sk.strokeWeight(thickness);
    sk.stroke((counter % 2 == 0) ? 255 : 0);
    drawCross(center.x, center.y, thickness, (counter * thickness) + radius);
    counter++;
  };
});
