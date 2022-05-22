import p5 from 'p5';

export class ShadedEllipse {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#field_declarations
  pointA;
  pointB;
  time;
  resolution;
  colorVectorA;
  colorVectorB;
  position ;
  size;
  value = 0;
  shader;
  sk; // p5 sketch
  counter = 0.0;
  shot = 0.0;

  constructor({ size=[10, 10], position=[0, 0, 0], pointA=[0, 0], pointB=[0, 0], colorVector, sk }) {
    this.size = size;
    this.position = position;
    this.pointA = sk.createVector(...pointA);
    this.pointB = sk.createVector(...pointB);
    this.colorVectorA = (colorVector || p5.Vector.random3D()).array().map(v => Math.abs(v));
    this.colorVectorB = (colorVector || p5.Vector.random3D()).array().map(v => Math.abs(v));
    this.sk = sk;
  }

  setResolution([x, y]) {
    this.resolution = [x, y];
    if (this.shader) {
      this.shader.setUniform("u_resolution", [x, y])
    };
  }

  setShader(shader) {
    this.shader = shader;
  }

  setTexture(texture) {
    this.texture = texture;
    this.texture.noStroke();
  }

  emitShot() {
    const sk = this.sk;
    this.pointA = sk.createVector(sk.random(0.0, 0.5), sk.random(0.0, 0.5));
    this.pointB = sk.createVector(sk.random(0.0, 0.5), sk.random(0.0, 0.5));
    
    this.counter = 0.0;
    this.incrementShot();
    console.log(this.colorVectorA, this.colorVectorB, this.pointA, this.pointB);
  }

  incrementShot() {
    if (this.shot < Math.PI) {
      this.shot += 0.05;
    } else {
      this.shot = 0.0;
    }
    return Math.sin(this.shot);
  }

  draw() {
    if (this.shader) {
      this.texture.shader(this.shader); 
    }
     
    // sk.shader(sphereShader1); 
    const time = this.shot > 0.0 ? this.incrementShot() : 0.0;
    this.shader.setUniform('u_time', time );
    (this.counter < 1.0) ? this.counter += 0.01 : this.counter = 1.0;
    
    const originA = p5.Vector.lerp(this.pointA, this.pointB, this.counter);
    const originB = p5.Vector.lerp(this.pointB, this.pointA, this.counter);
    this.shader.setUniform('u_resolution', [this.resolution[0], this.resolution[1]]);
    this.shader.setUniform('u_originA', [originA.x, originA.y]);
    this.shader.setUniform('u_originB', [originB.x, originB.y]);

    this.shader.setUniform('u_vector1', this.colorVectorA);
    this.shader.setUniform('u_vector2', this.colorVectorB);

    // CRUCIAL STEP THAT I DONT UNDERSTAND
    this.texture.rect(0, 0, this.resolution[0], this.resolution[1]);
    
     /* when you put a texture or shader on an ellipse it is rendered in 3d,
     so a fifth parameter that controls the # vertices in it becomes necessary,
     or else you'll have sharp corners. setting it to 100 is smooth. */
    // let ellipseFidelity = int(map(mouseX, 0, width, 8, 100));
    this.sk.push();
    this.sk.translate(-this.sk.width/2, -this.sk.height/2);
    this.sk.texture(this.texture);
    
    this.sk.ellipse(this.position[0], this.position[1], this.size[0], this.size[1], 50);
    
    this.sk.pop();
  }
}
