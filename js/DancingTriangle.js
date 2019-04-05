const motionTypes = Object.freeze({
  UP_DOWN: 0,
  CLOCKWISE: 1,
  WAVE: 2,
  FOLD: 3,
  SAWTOOTH: 4,
});


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

  update = (milliseconds) => {
    this.counter = milliseconds / 300;

    let tw_delta, th_delta;

    if (DancingTriangle.shouldMove) {
      // moves from left to right
      this.move();
    }

    switch (DancingTriangle.motionType) {

      case motionTypes.UP_DOWN: // up and down
        th_delta = Math.sin(this.counter) * this.height;

        this.x1 = this.posx;
        this.y1 = this.posy;

        this.x2 = this.x1 + this.width/2;
        this.y2 = this.posy + th_delta;

        this.x3 = this.x1 + this.width;
        this.y3 = this.posy;

        break;

      case motionTypes.CLOCKWISE: // clock like
        th_delta = Math.sin(this.counter) * this.height;
        tw_delta = (Math.cos(this.counter) + 1) * this.width/2;

        this.x1 = this.posx;
        this.y1 = this.posy;

        this.x2 = this.x1 + this.width/2;
        this.y2 = this.posy + th_delta;

        this.x3 = this.posx + tw_delta;
        this.y3 = this.posy;
        break;

      case motionTypes.WAVE: // oscillate
        th_delta = Math.sin(this.counter) * this.height;
        tw_delta = (Math.sin(this.counter) + 1) * this.width/2;

        this.x1 = this.posx;
        this.y1 = this.posy;

        this.x2 = this.x1 + this.width/2;
        this.y2 = this.posy + th_delta;

        this.x3 = this.posx + tw_delta;
        this.y3 = this.posy;
        
        break;
  
      case motionTypes.FOLD: // fold
        tw_delta = ((Math.cos(this.counter) + 1)/2);
        th_delta = Math.sin(this.counter);

        this.x1 = this.posx + (tw_delta * this.width/2);
        this.y1 = this.posy; 

        this.x2 = this.posx + this.width/2;
        this.y2 = this.posy + (th_delta * this.height); 

        this.x3 = (this.posx + this.width) - (tw_delta * this.width/2);
        this.y3 = this.posy;
        break;

      case motionTypes.SAWTOOTH: // saw tooth
        tw_delta = Math.sin(this.counter)/2 - 1;
        th_delta = (Math.cos(this.counter) + 1)/2;

        this.x1 = this.posx + (tw_delta * this.width/2);
        this.y1 = this.posy;

        this.x2 = this.x1 + this.width/2;
        this.y2 = this.posy + (th_delta * this.height); 
        
        this.y3 = this.posy;
        this.x3 = (this.posx + this.width) + (tw_delta * this.width/2);
        break;

      default:
        break;
    }
  };

  draw(sk, rotation=0) {
    this.isOffScreenX = this.x1 > sk.width + this.width/2;
    this.isOffScreenY = this.y1 > sk.height + this.height/2;

    sk.beginShape();
    sk.rotateX(rotation);
    sk.vertex(this.x1, this.y1);
    sk.vertex(this.x2, this.y2);
    sk.vertex(this.x3, this.y3);
    sk.endShape(sk.CLOSE);
  }

  static switchMotion() {
    if (DancingTriangle.motionType < (Object.keys(motionTypes)).length - 1) {
      DancingTriangle.motionType++;
    } else {
      DancingTriangle.motionType = motionTypes.UP_DOWN;
    }
    console.log(`motion is now ${DancingTriangle.motionType}`);
  }
};


DancingTriangle.shouldMove = false; // scroll from left to right
DancingTriangle.motionType = motionTypes.UP_DOWN;

export default DancingTriangle;