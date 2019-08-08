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
  xFactor = 1;
  yFactor = 1;
  zFactor = 1;
  angle = 0.;
  drawZ = false;

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
    const x = this.radius * Math.sin(Math.PI/2 + this.angle * this.xFactor);
    const y = this.radius * Math.sin(this.angle * this.yFactor);
    let z = this.radius * Math.cos(this.angle);
    if (this.vertices.length > this.verticesTail) {
      this.vertices.shift();
    }

    z = this.drawZ ? z : 1;
    this.vertices.push({x, y, z});
  }
  draw(mode) {
    this.update();
    $p5.noFill();
    $p5.stroke(this.color);
    

    if (mode) {
      $p5.beginShape(mode);
      this.vertices.forEach((v) => {
        $p5.vertex(v.x, v.y, v.z);
      });
      $p5.endShape();
    } else {
      this.vertices.forEach((v, i) => {
        $p5.ellipse(v.x, v.y, v.cosz);
      });
    }
  }
};

