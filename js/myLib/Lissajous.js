export default class Liss {
  data = null;
  color = 'black';
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
    this.speed = { x, y, z };
  }
  setPos({ x, y, z }) {
    this.pos.x = x ? x : this.pos.x;
    this.pos.y = y ? y : this.pos.y;
    this.pos.z = z ? z : this.pos.z;
  }

  update(sk) {
    this.angle += this.speed.x/100;

    this.rad = sk.lerp(this.data, this.data * (this.data/100), Math.sin(sk.millis())); 
    // console.log(this.data/100, this.rad);

    this.addVertice();
    // if (this.currentPos != this.pos) {
    //   this.currentPos = (this.pct * this.currentPos) + (1. - this.pct) * this.pos;
    // }
  }

  // set some data source
  setData(data) {
    // console.log("set data", data);
      this.data = data;
    // set data
    // then vertice data needs to be interpolated with addVertice
  }

  addVertice() {
    const x = this.rad * Math.cos(this.angle * this.xFactor);
    const y = this.rad * Math.sin(this.angle * this.yFactor);
    const z = this.rad * Math.sin(this.angle * this.zFactor);
    
    if (this.vertices.length > this.verticeTail) {
      this.vertices.shift();
    }
    this.vertices.push({x, y, z});
  }
  draw(sk) {
    this.update(sk);
    sk.noFill();
    sk.stroke(this.color);
    
    sk.beginShape();
    // console.log(data);
    // this.xFactor = data[1];
    // this.yFactor = data[15];
    // this.zFactor = data[100];

    this.vertices.forEach((v) => {
      // $p5.ellipse(v.x, v.y, 1);
      sk.vertex(v.x, v.y, v.z);
    });
    sk.endShape();
  }
};

