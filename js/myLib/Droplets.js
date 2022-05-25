import p5 from 'p5';

// Droplet/leaf shape from quadrilateral
export class Droplets {

  constructor(sk) {
    this.dropletCount = 1; // Math.ceil(sk.random(2,5));
    this.pts = [];
    this.opacities = Array.from(Array(this.dropletCount), () => 255.0);
    this.xy = { x: sk.width/2, y: sk.height/2 };
    this.sk = sk;
    this.generatePoints();
  }

  generatePoints() {
    for (let d =0; d < this.dropletCount; d++)
      this.pts.push([
        this.sk.createVector(0, 50), //top
        this.sk.createVector(-75, 120),//left
        this.sk.createVector(0, 150),//bottom
        this.sk.createVector(60, 100) //right  
    ]);
  }

  draw_leaf(points, opacity) {
    // strokeCap(ROUND);
    const sk = this.sk;
    // strokeWeight(2);
    // sk.stroke(255);
    // // sk.noStroke();
    const color = sk.color(255);
    color.setAlpha(opacity);
    sk.fill(color);
    const [ top, left, btm, right ] = points;
    
    const a1 = p5.Vector.lerp(top, left, 0.9);
    const a2 = p5.Vector.lerp(left, btm, 0.9);
    const b1 = p5.Vector.lerp(btm, right, 0.9);
    const b2 = p5.Vector.lerp(right, top, 0.9);
    // lerp top/left lerp left bottom
    // btm = this.pts[2];
    // let p1 = p5.Vector.lerp(points[1], points[2], 0.5);
    // // let p1_reverse = p5.Vector.lerp(points[3], points[2], 0.5);
    // let p2 = p5.Vector.lerp(points[0], points[2], 0.95);
    // let p23 = p5.Vector.lerp(points[2], points[3], 0.75);
    // // let p23_reverse = p5.Vector.lerp(points[2], points[1], 0.75);
    // let p3 = p5.Vector.lerp(points[1], p23, 0.95)
    // // let p3_reverse = p5.Vector.lerp(points[3], p23_reverse, 0.95);
    // let p4 = p5.Vector.lerp(points[3], points[0], 0.8);
    // // let p4_reverse = p5.Vector.lerp(points[1], points[0], 0.8);
    // let p_5 = p5.Vector.lerp(p4, points[1], 0.09);
    // // let p_5_reverse = p5.Vector.lerp(p4_reverse, points[3], 0.09);
    // let p6 = p5.Vector.lerp(points[0], points[2], 0.05);
  
    sk.beginShape();
    sk.vertex(top.x, top.y);
    sk.bezierVertex(a1.x, a1.y, 0, a2.x, a2.y, 0, btm.x, btm.y, 0);
    sk.vertex(btm.x, btm.y);
    sk.bezierVertex(b1.x, b1.y, 0, b2.x, b2.y, 0, top.x, top.y, 0);
    sk.endShape();
    
  //   stroke(255, 0, 0);
  //   point(p1.x, p1.y);
  //   point(p2.x, p2.y);
  //   point(p3.x, p3.y);
  //   point(p4.x, p4.y);
  //   point(p_5.x, p_5.y);
  //   point(p6.x, p6.y);
  //   point(p6.x, p6.y);
  }
  
  draw() {
    const sk = this.sk;
    // sk.background(220);
    // sk.noFill();
    
    // if (!this.opacities.filter((o) => o > 0.0).length) {
    //   // relocate
    //   // pick random place on screen
    //   this.xy = { x: Math.random() * sk.width, y: Math.random * sk.height };
    // }
    
    // tranlate to random place
    sk.push();
    sk.translate(this.xy.x - sk.width/2,this.xy.y - sk.height/2 );
    this.pts.forEach((pts, i) => {
      // rotate and translate a bit for each one
      // scale ?
      //sk.translate(i * 5, i * 10);
      //sk.rotate(Math.random() * 180);
      const op = this.opacities[i];
      (op > 0.0) ? (this.opacities[i] = op - (1 * i+1)) : this.opacities[i] = 0.0;
      console.log(this.opacities[i]);
      this.draw_leaf(pts, this.opacities[i])

    });
    sk.pop();
  }
}
