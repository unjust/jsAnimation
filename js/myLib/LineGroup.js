import p5 from 'p5';

export class CurvedLineGroup {

  constructor({ len=60, centerX=0, centerY=0, xRadius=200, yRadius=200, sk }) {
    this.len = len;
    this.buffer = Array.from(Array(len), () => ({ x: 0, y: 0 }));
    this.newestLine = 0;
    this.sk = sk;
    this.centerX = centerX;
    this.centerY = centerY;
    this.xRadius = xRadius;
    this.yRadius = yRadius;
  }
  
  draw(keepDrawing) {
    const sk = this.sk;

    const t = sk.millis()/500;
    const bufferLen = this.buffer.length;

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    this.newestLine = sk.frameCount % bufferLen;
      
    if (keepDrawing) {
      this.buffer[this.newestLine] = { x: this.centerX + this.xRadius * Math.cos(t), y: this.centerY + this.yRadius * Math.sin(2*t) / 2 };
                                // { x: 200 + 200 * Math.cos(t), y: 300 + 200 * Math.sin(2*t) / 2 };
    }
    else {
      this.buffer[this.newestLine] = undefined;
    }

    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);

    sk.fill(255, 153);
    sk.stroke(255, 153);
    for (let i = 0; i < bufferLen; i++) {
      // which+1 is the smallest (the oldest in the array)
      let index = (this.newestLine + 1 + i) % bufferLen;
      const xy = this.buffer[index];
      // sk.ellipse(xy.x, xy.y, i, i);
      if (xy) {
        // console.log(xy);
        sk.line(xy.x, xy.y, xy.x + 100, xy.y + 100 - i);
      }
    }
    sk.pop();
  }
}

export class BezierLineGroup {
  direction;
  pointB;

  constructor(sk) {
    this.len = 30;
    this.currentIndex = 0;
    this.startIndex = 0;
    this.sk = sk;
    this.bezierPoints = [];
    this.createBezierPoints(this.sk.millis());
    this.addToBuffer = false;
  }

  createBezierPoints(t) {
    const width = this.sk.width;
    const height = this.sk.height;
    this.bezierPoints = [ 
      width / 2 * this.sk.noise(t + 15),
      width / 2 * this.sk.noise(t + 25),
      width / 2 * this.sk.noise(t + 35),
      width / 2 * this.sk.noise(t + 45),
      height * this.sk.noise(t + 55),
      height * this.sk.noise(t + 65),
      height * this.sk.noise(t + 75),
      height * this.sk.noise(t + 85)
    ];
    //this.direction = new p5.Vector.random2D();
    this.endPoint = this.sk.createVector(Math.random() * width, Math.random() * height);
  }
  reset() {
    if (this.startIndex < this.currentIndex) {
      return;
    }
  

    // https://math.stackexchange.com/a/175906
    // const distance = 20;
    // const u = p5.Vector.sub(v1, v2).normalize();
    // const point = p5.Vector.add(pointA, u.multiply(distance));
    // draw a bezier random 
    // draw lines normal to a bezier?

    this.createBezierPoints(this.sk.millis());
    this.addToBuffer = true;
    this.currentIndex = 0;
  }

  draw(keepDrawing) {
    const sk = this.sk;

    const t = sk.millis()/500;

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    // this.newestLine = sk.frameCount % bufferLen;
    
    if (this.addToBuffer && this.currentIndex < this.len) {
      this.currentIndex += 1; // draw along the curve
      this.startIndex = 0;
    } else {
      this.addToBuffer = false;
      this.startIndex++;
    }

    sk.push();
   
    sk.noFill();
    const color = sk.color(255, 153);
    // const dir = p5.Vector.mult(this.pointA, 10);
    const point1Vec = this.sk.createVector(this.bezierPoints[0], this.bezierPoints[1]);
    const totalVector = p5.Vector.sub(point1Vec, this.endPoint).normalize();
    // const point = p5.Vector.add(point1Vec.normalize(), u.mult(dist));
    const spacing = 12;;
    sk.translate(-sk.width/2 +
      point1Vec.x + (this.startIndex * spacing * totalVector.x), 
      -sk.height/2 + point1Vec.y + (this.startIndex * spacing * totalVector.y)
    );

    for (let i = this.startIndex; i < this.currentIndex; i++) {
      const freq = (i - this.startIndex)/(this.currentIndex - this.startIndex) * Math.PI;
      color.setAlpha(Math.sin(freq) * 255.0);
      sk.stroke(color);
      // which+1 is the smallest (the oldest in the array) 
      // console.log(u.x * 10, u.y * 10);
      sk.translate(spacing * totalVector.x, spacing * totalVector.y);
      sk.bezier(...this.bezierPoints)
    }
    sk.pop();
  }
}
