export class LineGroup {}

export class CurvedLineGroup {

  constructor({ len=60, centerX=0, centerY=0, sk }) {
    this.len = len;
    this.buffer = Array.from(Array(len), () => ({ x: 0, y: 0 }));
    this.newestLine = 0;
    this.sk = sk;
    this.centerX = centerX;
    this.centerY = centerY;
  }
  
  draw() {
    const sk = this.sk;

    const t = sk.millis()/500;
    // const scale = 2 / (3 - Math.cos(2*t));

    const bufferLen = this.buffer.length;

    // https://gamedev.stackexchange.com/questions/43691/how-can-i-move-an-object-in-an-infinity-or-figure-8-trajectory
    this.newestLine = sk.frameCount % bufferLen;
      
    // if (drawLine) {
    this.buffer[this.newestLine] = { x: 200 + 200 * Math.cos(t), y: 300 + 200 * Math.sin(2*t) / 2 };
    // } else {
    //   lineBuffer[newestLine] = undefined;
    // }

    sk.push();
    sk.translate(-sk.width/2 + this.centerX, -sk.height/2 + this.centerY);

    sk.fill(255, 153);
    sk.stroke(255, 153);
    for (let i = 0; i < bufferLen; i++) {
      // which+1 is the smallest (the oldest in the array)
      let index = (this.newestLine + 1 + i) % bufferLen;
      const xy = this.buffer[index];
      // sk.ellipse(xy.x, xy.y, i, i);
      if (xy) {
        sk.line(xy.x, xy.y, xy.x + bufferLen - 1, xy.y + bufferLen - i);
      }
    }
    sk.pop();
  }
}
