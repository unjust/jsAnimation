export default class Curve {
  path = [];
  
  addPoint(x, y) {
    this.path.push($p5.createVector(x, y));
  }

  draw() {
    $p5.stroke('white');
    $p5.strokeWeight(1);
    $p5.beginShape();
    this.path.forEach((p, i) => {
      $p5.vertex(p.x, p.y);
    });
    $p5.endShape();
  }
};
