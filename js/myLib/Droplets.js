import p5 from 'p5';

// Droplet/leaf shape from quadrilateral
export class Droplets {

  constructor(sk) {
    this.dropletCount = 5; // Math.ceil(sk.random(2,5));
    this.showCount = 0;
    this.pts = [];
    this.translations = [];
    this.rotations = [];
    this.opacities = Array.from(Array(this.dropletCount), () => 255.0);
    this.xy = { x: sk.width/2, y: sk.height/2 };
    this.sk = sk;
    this.generatePoints();
  }

  generatePoints() {
    const sk = this.sk;
    this.pts = [];
    this.translations = [];
    this.rotations = [];
    for (let d = 0; d < this.dropletCount; d++) {
      this.pts.push([
        this.sk.createVector(0, 50), //top
        this.sk.createVector(-75, 120), //left
        this.sk.createVector(0, 150), //bottom
        this.sk.createVector(60, 100) //right  
      ]);
      this.translations.push([sk.random(-80, 80), sk.random(80, 100)]);
      this.rotations.push(sk.random(-.7, .7));
    }
  }

  step() {
    if (this.showCount < this.dropletCount) {
      this.showCount++
    } else {
      this.showCount = 0;
    }
  }

  reset() {
    this.showCount = 0;
    const edgesX = [Math.random() * this.sk.width/4, (this.sk.width * .75) + Math.random() * this.sk.width/4];
    const edgesY = [Math.random() * this.sk.height/4, (this.sk.height * .75) + Math.random() * this.sk.height/4];
    this.xy = { x: this.sk.random(edgesX), y: this.sk.random(edgesY) };
    this.opacities = Array.from(Array(this.dropletCount), () => 255.0);
    this.generatePoints();
  }

  draw_leaf(points, opacity) {
    // strokeCap(ROUND);
    const sk = this.sk;
    // strokeWeight(2);
    // sk.stroke(255);
    // // sk.noStroke();
    const color = sk.color('#82a1b1');
    color.setAlpha(opacity);
    sk.fill(color);
    const [ top, left, btm, right ] = points;
    
    const a1 = p5.Vector.lerp(top, left, 0.9);
    const a2 = p5.Vector.lerp(left, btm, 0.9);
    const b1 = p5.Vector.lerp(btm, right, 0.9);
    const b2 = p5.Vector.lerp(right, top, 0.9);

    sk.beginShape();
    sk.vertex(top.x, top.y);
    sk.bezierVertex(a1.x, a1.y, 0, a2.x, a2.y, 0, btm.x, btm.y, 0);
    sk.vertex(btm.x, btm.y);
    sk.bezierVertex(b1.x, b1.y, 0, b2.x, b2.y, 0, top.x, top.y, 0);
    sk.endShape();
  }
  
  draw() {
    const sk = this.sk;

    if (!this.opacities.filter(o => o > 0.0).length) {
      this.reset();
    }

    sk.push();
    sk.translate(this.xy.x - sk.width/2,this.xy.y - sk.height/2 );
    sk.scale(0.7);
    this.pts.slice(0, this.showCount + 1).forEach((pts, i) => {
      sk.translate(this.translations[i][0], this.translations[i][1]);
      sk.rotateZ(this.rotations[i]);
      
      const op = this.opacities[i];
      (op > 0.0) ? (this.opacities[i] = op - (1 * i+2)) : this.opacities[i] = 0.0;
      // console.log(this.opacities[i]);
      this.draw_leaf(pts, this.opacities[i])
    });
    sk.pop();
  }
} 
