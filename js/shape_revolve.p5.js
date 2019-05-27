import p5 from "p5";
import Cone from "./myLib/Cone.js";
import Cube from "./myLib/Cube.js";
import OrbitMixin from "./myLib/mixins/orbit.js";
import { createEasyCam } from "Libraries/easycam/p5.easycam.js";

const SET_COUNT = 2;
let shapeSets = [];

window.$p5 = new p5((sk) => {

  
  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    createEasyCam.bind(sk)();
    
    const speed = .05;
    
    for (let i = 0; i < SET_COUNT; i++) {
      const cone = new Cone(20, 50, 0, 0, 0);
      Object.assign(cone, OrbitMixin);
      cone.init(0, -speed, $p5.createVector(-40, 0, 0));

      const cube = new Cube(30, 0, 0, 0);
      Object.assign(cube, OrbitMixin);
      cube.init(0, speed, $p5.createVector(40, 0, 0));

      shapeSets.push({ cone, cube });
    }
    
  }

  sk.update = () => {
   // cone.position();
   // cube.position();
  }

  sk.draw = () => {
    $p5.clear();

    shapeSets.forEach((set, i) => {
      const { cone, cube } = set;
      
      $p5.push();
      // this will jitter $p5.translate(point.x, point.y, 0);

      $p5.push();
        cone.position();
        cone.draw();
      $p5.pop();

      $p5.push();
        cube.position();
        cube.draw();
      $p5.pop();

      $p5.pop();
    });
  }

});