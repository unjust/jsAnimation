import p5 from "p5";
import * as constants from "Framework/constants.js";

const OrbitMixin = {
   
  /**
   * @param {float} angle initial angle of orbit
   * @param {float} speed speed of orbiting
   * @param {Vector} position position of the thing thats going to orbit
   * @param {Vector} orbitPoint point to orbit around
   */
  initOrbit(
    angle, 
    speed=Math.random(), 
    position=p5.Vector.random3D(),
    orbitPoint=p5.Vector(1, 1, 1)) {

    this.orbitAngle = angle;
    this.orbitSpeed = speed;
    this.orbitPoint = orbitPoint;

    // how far the object is from the orbit
    this.distanceVector = p5.Vector.sub(orbitPoint, position); 

    this.rotateCounter = 0; // for rotation of shape individually
    this.rotateVector = p5.Vector.random3D();
  },

  update() {
    if (this.stopped) {
      return;
    }

    this.orbitAngle += this.orbitSpeed;
    this.rotateCounter += 0.01;
    // move the counter
    this.orbitPoint.add(.1, 0, 0);
  },

  // getShapePostion() {
  //   const sinAngle = Math.sin(this.orbitAngle);
  //   const cosAngle = Math.cos(this.orbitAngle);
  //   const x = this.distanceVector.x * cosAngle - this.distanceVector.y * sinAngle;
  //   const y = this.distanceVector.y * cosAngle  - this.distanceVector.x * sinAngle;
  //   return { x: x + this.orbitPoint.x, y: y + this.orbitPoint.y };ß
  // },

  drawDebug() {
    $p5.stroke('green');
    $p5.sphere(5);

    $p5.stroke('blue');
    $p5.line(
      0,
      0,
      0,
      this.distanceVector.x, 
      this.distanceVector.y, 
      this.distanceVector.z);
  },

  drawOrbit() {
    // debugger
    this.update();

    $p5.push();
  
    $p5.translate(
      this.orbitPoint.x, 
      this.orbitPoint.y,
      this.orbitPoint.z);

    $p5.rotate($p5.degrees(this.orbitAngle), constants.at); 

    // this.drawDebug();
    
    $p5.translate(
      this.distanceVector.x, 
      this.distanceVector.y,
      this.distanceVector.z);

    $p5.rotate($p5.degrees(this.rotateCounter), this.rotateVector); // rotate shape individually?

    this.draw();
    $p5.pop();
  }
}
export default OrbitMixin;
