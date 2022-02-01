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

    this.sk = this.sketch;
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
    this.sk.stroke('green');
    this.sk.sphere(5);

    this.sk.stroke('blue');
    this.sk.line(
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

    this.sk.push();
  
    this.sk.translate(
      this.orbitPoint.x, 
      this.orbitPoint.y,
      this.orbitPoint.z);

    this.sk.rotate(this.sk.degrees(this.orbitAngle), constants.at); 

    // this.drawDebug();
    
    this.sk.translate(
      this.distanceVector.x, 
      this.distanceVector.y,
      this.distanceVector.z);

    this.sk.rotate(this.sk.degrees(this.rotateCounter), this.rotateVector); // rotate shape individually?

    this.draw();
    this.sk.pop();
  }
}
export default OrbitMixin;
