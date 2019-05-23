const OrbitMixin = {
   
  init(a, speed=Math.random(), distanceVector=p5.Vector.random3D()) {
    this.angle = a;
    this.orbitSpeed = speed;
    this.distanceVector = distanceVector;
    this.rotateCounter = 0;
  },

  update() {
    if (this.stopped) {
      return;
    }
    this.angle += this.orbitSpeed;
  
    this.rotateCounter += 0.1;
  },

  debug() {
    // debug
    $p5.stroke('red');
    $p5.line(0, 0, 0, 
        this.distanceVector.x, 
        this.distanceVector.y, 
        this.distanceVector.z);
    
    $p5.stroke('blue');
    $p5.line(0, 0, 0, rotateAxis.x, rotateAxis.y, rotateAxis.z);  
  },

  position() {
      this.update();
  
      const up = $p5.createVector(0, 1, 0);
      const rotateAxis = up.cross(this.distanceVector);

      $p5.rotate($p5.degrees(this.angle), rotateAxis);

      $p5.translate(
          this.distanceVector.x, 
          this.distanceVector.y,
          this.distanceVector.z);

      $p5.rotate($p5.degrees(this.rotateCounter), this.distanceVector);
  }
}
export default OrbitMixin;