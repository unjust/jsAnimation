import p5 from "p5";
import { createEasyCam } from '../libs/easycam/p5.easycam.js';

let g_p5; // trying something new here so can use p5 everywhere
const planetPaths = [
  "img/2k_jupiter.jpg",
  "img/2k_mercury.jpg",
  "img/2k_neptune.jpg",
  "img/marsmap1k.jpg"
];

class Planet {
  radius;
  angle;
  distanceVector;
  moons = [];
  orbitSpeed;
  textureImg;

  constructor(r, d, a, img) {
    this.radius = r;
    this.diameter = this.radius * 2;
    this.angle = a;
    this.orbitSpeed = g_p5.random(-.003, .003) / (this.diameter/2);

    this.distanceVector = p5.Vector.random3D();
    if (d > 0) {
      this.distanceVector.mult(d);
    }

    this.textureImg = img;
  };

  spawnMoons(total, level=0) {
    for (let p = 0; p < total; p++) {
      // moon radius

      const r = g_p5.constrain(this.radius *  g_p5.random(.1, .9), 3, 80);

      // moon distance
      const minDist = this.radius + r + 10;
      const d = g_p5.random(minDist, minDist + 100 / (level + 1));
      const aPlanet = new Planet(
        r,
        d,
        g_p5.random(0, g_p5.TWO_PI),
        g_p5.loadImage(g_p5.random(planetPaths))
      );
  
      if (level < 3) {
        const moonCount = g_p5.random(0, 3);
        aPlanet.spawnMoons(moonCount, level + 1);
      }
      this.moons.push(aPlanet);
    }
  }

  orbit() {
    this.angle += this.orbitSpeed;
  }

  show(sk) {
    sk.fill(255);
    sk.noStroke();

    sk.push();   

    const up = sk.createVector(0, 1, 0);
    const rotateAxis = up.cross(this.distanceVector);

    sk.rotate(sk.degrees(this.angle), rotateAxis);

    /* debug
    sk.stroke('red');
    sk.line(0, 0, 0, 
      this.distanceVector.x, 
      this.distanceVector.y, 
      this.distanceVector.z);
    
    sk.stroke('blue');
    sk.line(0, 0, 0, rotateAxis.x, rotateAxis.y, rotateAxis.z);
    */
  
    sk.translate(
      this.distanceVector.x, 
      this.distanceVector.y,
      this.distanceVector.z);
    
    sk.noStroke();

    sk.texture(this.textureImg);
    
    sk.sphere(this.radius);

    this.moons.forEach((m) => {
      m.orbit();
      m.show(sk);
    });

    sk.pop();
  };
}

new p5((sk) => {
  g_p5 = sk;
  let cam;
  
  let sun = new Planet(60, 0, 0, sk.loadImage("img/2k_sun.jpg"));
  sun.spawnMoons(2);

  sk.setup = () => {
    sk.createCanvas(500, 500, sk.WEBGL);
    sk.background(0);
    cam = createEasyCam.bind(sk)();
  };

  sk.draw = () => {
    sk.clear();
    sk.background(0);
    sk.directionalLight(255, 255, 255, 0, 0, -120);
    sun.show(sk);
  };
});