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

  isOffScreenX = false;
  isOffScreenY = false;

  // posx and posy = center
  constructor(posx, posy, w, h, id) {
    this.id = id;
  
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

  move = (xinc=.1, yinc=0) => {
    if (this.isOffScreenX || this.isOffScreenY) {
      this.posx = this.isOffScreenX ? -this.width : this.posx;
      this.posy = this.isOffScreenY ? -this.height : this.posy;
    } else {
      this.posx += xinc;
      this.posy += yinc;
    }
  };

  update = () => {
    this.counter += .03;

    let tw_delta, th_delta;

    switch (DancingTriangle.motionType) {

      case 0:
        // moves from left to right
        this.move();

        tw_delta = ((Math.cos(this.counter) + 1)/2);
        th_delta = Math.sin(this.counter);

        this.x1 = this.posx + (tw_delta * this.width/2);
        this.y1 = this.posy; 

        this.x2 = this.posx + this.width/2;
        this.y2 = this.posy + (th_delta * this.height); 

        this.x3 = (this.posx + this.width) - (tw_delta * this.width/2);
        this.y3 = this.posy;
        break;

      case 1:
        tw_delta = Math.sin(this.counter)/2 - 1;
        th_delta = (Math.cos(this.counter) + 1)/2;

        this.x1 = this.posx + (tw_delta * this.width/2);
        this.y1 = this.posy;

        this.x2 = this.posx + this.width/2;
        this.y2 = this.posy + (th_delta * this.height); 
        
        this.y3 = this.posy;
        this.x3 = (this.posx + this.width) + (tw_delta * this.width/2);
        break;

      case 2:
        break;

      default:
        break;
    }
  };

  draw(sk) {
    this.isOffScreenX = this.x1 > sk.windowWidth + this.width/2;
    this.isOffScreenY = this.y1 > sk.windowHeight + this.height/2;
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
      t.update();
      t.draw(sk);
    });
  };
});