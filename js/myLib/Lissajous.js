export default class Lissajous {
  color = 'white';
  radius = 10;
  speed = .01;
  vertices = [];
  verticesTail = 100;
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
  setSpeed(s) {
    this.speed = s;
  }
  setPos({ x, y, z }) {
    this.pos.x = x ? x : this.pos.x;
    this.pos.y = y ? y : this.pos.y;
    this.pos.z = z ? z : this.pos.z;
  }
  update() {
    this.angle += this.speed;
    this.addVertice();
  }
  addVertice() {
    const x = this.radius * Math.cos(this.angle * this.xFactor);
    const y = this.radius * Math.sin(this.angle * this.yFactor);
    const z = this.radius * Math.sin(this.angle);
    if (this.vertices.length > this.verticesTail) {
      this.vertices.shift();
    }
    this.vertices.push({x, y, z});
  }
  draw(mode) {
    this.update();
    $p5.noFill();
    $p5.stroke(this.color);
    
    if (mode) {
       $p5.beginShape(mode);
      this.vertices.forEach((v) => {
        $p5.vertex(v.x, v.y, 1);
      });
      $p5.endShape();
    } else {
      this.vertices.forEach((v, i) => {
        $p5.ellipse(v.x, v.y, 1);
      });
    }
  }
};

