import p5 from 'p5';

new p5((s) => {

  let pos = s.createVector(1, 1);

  let speed = s.createVector(1., 3.);

  const update = function() {
    if (pos.x > s.width || pos.x < 0) {
      speed.x *= -1;
    } else if (pos.y > s.height || pos.y < 0) {
      speed.y *= -1;
    }
    pos.add(speed);
  };

  s.setup = function() {
    s.createCanvas(400, 300);
    s.background(0);
  };

  s.draw = function() {
    update();
    s.background(0);
    s.ellipse(pos.x, pos.y, 10);
  };
});

