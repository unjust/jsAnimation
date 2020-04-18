import p5 from 'p5';
// import DancingTriangle from 'Framework/DancingTriangle';

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
    this.counter += .003;

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

  let counter = 0;
  
  sk.setup = () => {
    sk.createCanvas(500, 500, sk.WEBGL);
    console.log("Triangle storm: trying to add a 3D element");
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

  sk.update = () => {
    counter+=0.01;
  }

  sk.draw = () => {
    sk.background(200);
    sk.update();
    const offscreenMargin = 10;

    sk.push();
    sk.translate(-sk.windowWidth/2, -sk.windowHeight/2);
    
    triangles.forEach((t, i, arr) => {
      t.update();
      if (t.x1 > sk.windowWidth + offscreenMargin || t.y1 > sk.windowHeight + offscreenMargin ) {
        arr.splice(i, 1);
        // replaceTriangles++;
      } else {
        sk.rotateY(Math.sin(counter)/3);
        t.draw(sk);
      }
    });
  
    sk.pop();
  };
});
