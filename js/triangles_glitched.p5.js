import p5 from 'p5';

let scroll = 0;

class DancingTriangle {
  posx = 0;
  posy = 0;
  x1 = 0;
  x2 = 0;
  x3 = 0;
  y1 = 0;
  y2 = 0;
  y3 = 0;
  width = 0;
  height = 0;
  counter = 0;

  constructor(posx, posy, w, h) {
    this.posx = posx;
    this.posy = posy;
    this.width = w;
    this.height = h;

    this.x1 = posx;
    this.y1 = posy;
    this.x2 = this.x1 + this.width/2;
    this.y2 = this.y1 + this.height;
    this.x3 = this.x1 + this.width;
    this.y3 = this.y1;
  }

  update = () => {
    this.counter += .03;

    let tw_delta, th_delta;
    switch (DancingTriangle.motionType) {
      case 0:
        tw_delta = ((Math.cos(this.counter) + 1)/2);
        th_delta = Math.sin(this.counter);
        this.x1 = this.posx + (tw_delta * this.width/2);
        this.y2 = this.posy + (th_delta * this.height); 
        this.x3 = (this.posx + this.width) - (tw_delta * this.width/2);
        break;

      case 1:
        tw_delta = Math.sin(this.counter)/2 - 1;
        th_delta = (Math.cos(this.counter) + 1)/2;
        this.x1 = this.posx + (tw_delta * this.width/2);
        this.y2 = this.posy + (th_delta * this.height); 
        this.x3 = (this.posx + this.width) + (tw_delta * this.width/2);
        break;

      case 2:
        this.y1 += scroll;
        this.y2 += scroll;
        this.y3 += scroll;
        break;

      default:
        break;
    }
  };

  draw(sk) {
    sk.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
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
    console.log("Triangle motions with a little bit of glitch");
    sk.createTriangles();
  };

  sk.createTriangles = function(count) {
    for (let x = 0; x < sk.windowWidth; x += tw) {
      for (let y = 0; y < sk.windowHeight; y += th) {
        triangles.push(new DancingTriangle(x, y, tw, th));
        if (count && count-- && count === 0) {
          break;
        }
      }
    }
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
    const offscreenMargin = 10;

    let replaceTriangles = 0;

    triangles.forEach((t, i, arr) => {
      t.update();
      if (t.x1 > sk.windowWidth + offscreenMargin || t.y1 > sk.windowHeight + offscreenMargin ) {
        arr.splice(i, 1);
        replaceTriangles++;
      } else {
        t.draw(sk);
      }
    });
    if (replaceTriangles > 0) {
      console.log("replace", replaceTriangles);
      sk.createTriangles(replaceTriangles);
    }
  };
});