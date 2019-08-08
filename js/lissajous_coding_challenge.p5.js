import p5 from 'p5';

class Curve {
  path = [];
  
  addPoint(x, y) {
    this.path.push($p5.createVector(x, y));
  }

  draw() {
    $p5.stroke('white');
    $p5.strokeWeight(1);
    $p5.beginShape();
    this.path.forEach((p, i) => {
      $p5.vertex(p.x, p.y);
    });
    $p5.endShape();
  }
};

// sin -1 and 1
// polar coordinates
// cartesian coordinates

// harmonic motion on two axes, if moving at the same speed,
// you get a circle
// at different speeds something different

window.$p5 = new p5((sk) => {
  let angle = - sk.HALF_PI;

  const CANVAS = 600,
    COLS = 10,
    ROWS = COLS,
    DIM = CANVAS / COLS;

  const curves = [];
  const diameter = DIM - 10,
    r = diameter / 2;

  sk.setup = () => {
    sk.createCanvas(CANVAS, CANVAS);
    sk.background('black');
    sk.stroke('white');
    for (let i = 0; i < COLS * ROWS;i++) {
      curves.push(new Curve());
    }
  };

  sk.update = () => {
    angle += 0.01;
  };

  sk.draw = () => {
    sk.update();
    sk.clear();
    sk.background('black');
    
    sk.noFill();

    for (let i = 0; i < curves.length; i++) {
      let iColumn = i % COLS;
      let iRow = Math.floor( i / ROWS );

      let cx = DIM * (iColumn + (iRow == 0 ? 1 : 0)) + DIM/2;
      let cy = iRow * DIM + DIM/2;

      let speedX = angle * (iColumn + 1);
      let speedY = angle * (iRow + 1);

      //console.log(iColumn, iRow, speedX, speedY);
      let x = r * Math.cos(speedX);
      let y = r * Math.sin(speedY);
      
      sk.stroke('white');
      sk.strokeWeight(1);
      //sk.ellipse(cx, cy, diameter);

      curves[i].addPoint(cx + x, cy + y);
      // sk.point(cx + x, cy + y);

      if (iRow === 0) {
        sk.strokeWeight(1);
        sk.stroke(255, 10);
        sk.line(cx + x, 0, cx + x, sk.height);
      }
    }
    curves.forEach((c) => c.draw());
  }
});
