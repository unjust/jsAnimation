export default class Liss {
  color = 'white';
  rad = 10;
  speed = {
    x: .01,
    y: .01,
    z: .01
  };
  vertices = [];
  verticeTail = 100;
  pos = { 
    x: 0,
    y: 0,
    z: 0
  }
  currentPos = { 
    x: 0,
    y: 0,
    z: 0
  }
  pct = 0;
  xFactor = 1;
  yFactor = 1;
  zFactor = 1;
  angle = 0.;

  setColor(colorString) {
    this.color = colorString;
  }
  setSpeed(x=1, y=1, z=1) {
    this.speed = { x, y, z};
  }
  setPos({ x, y, z }) {
    this.pos.x = x ? x : this.pos.x;
    this.pos.y = y ? y : this.pos.y;
    this.pos.z = z ? z : this.pos.z;
  }
  update() {
    this.angle += this.speed.x;
    this.addVertice();
    // if (this.currentPos != this.pos) {
    //   this.currentPos = (this.pct * this.currentPos) + (1. - this.pct) * this.pos;
    // }
  }
  addVertice() {
    const x = this.rad * Math.cos(this.angle * this.xFactor);
    const y = this.rad * Math.sin(this.angle * this.yFactor);
    const z = this.rad * Math.sin(this.angle);
    if (this.vertices.length > this.verticeTail) {
      this.vertices.shift();
    }
    this.vertices.push({x, y, z});
  }
  draw() {
    this.update();
    $p5.stroke(this.color);
    $p5.noFill();
    $p5.stroke(this.color);
    
    this.vertices.forEach((v, i) => {
      $p5.ellipse(v.x, v.y, 1);
    });
  }
};

