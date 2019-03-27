import p5 from 'p5';

class DancingTriangle {
  width = 0;
  height = 0;
  th_delta = 0;
  tw_delta = 0;
  counter = 0;

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  update = () => {
    this.counter += .03;

    switch (DancingTriangle.motionType) {
      case 0:
        this.th_delta = Math.sin(this.counter) * this.height;
        this.tw_delta = (Math.cos(this.counter) + 1) * this.width/2;
        break;
      case 1:
        this.th_delta = Math.sin(this.counter) * this.height;
        this.tw_delta = (Math.sin(this.counter) + 1) * this.width/2;
        break;
      case 2:
        this.th_delta = Math.cos(this.counter) * this.height;
        this.tw_delta = (Math.cos(this.counter) + 1) * this.width/2;
        break;
      default:
        break;
    }
  };

  draw(sk) {
    sk.triangle(this.x, this.y,
      this.x + this.width/2, this.y + this.th_delta,
      this.x + this.tw_delta, this.y);
  }

  static switchMotion() {
    if (DancingTriangle.motionType < 2) {
      ++DancingTriangle.motionType;
    } else {
      DancingTriangle.motionType = 0;
    }
    console.log(DancingTriangle.motionType);
  }
};

DancingTriangle.motionType = 0;

new p5((sk) => {

  const DIM = 20;
  let th = DIM * 1.5;
  let tw = DIM * 2;

  let triangles = [];

  sk.setup = () => {
    sk.createCanvas(500, 500);

    for (let x = 0; x < sk.windowWidth; x += tw) {
      for (let y = 0; y < sk.windowHeight; y += th) {
        triangles.push(new DancingTriangle(x, y, tw, th));
      }
    }
  };

  sk.keyPressed = () => {
    DancingTriangle.switchMotion();
  };

  sk.draw = () => {
    sk.background(200);
    triangles.forEach((t) => {
      t.update();
      t.draw(sk);
    });
  };
});