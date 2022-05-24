import p5 from 'p5';

export class BackgroundGradient {
  pointA; 
  pointB; 
  pointC;
  pointD;
  colorA = [Math.random(), Math.random(), Math.random()];
  colorB = [Math.random(), Math.random(), Math.random()];
  bgTrigger = 0.0;
  counter = 0.0;

  constructor(vert='shaders/standard.vert', frag='shaders/colorClouds.frag', sk) {
    // for gradient clouds
    this.gradientShader = sk.loadShader(vert, frag);
    this.bgTexture = sk.createGraphics(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    this.bgTexture.noStroke();

    this.sk = sk;

    this.pointA = p5.Vector.random2D(); 
    this.pointB = p5.Vector.random2D(); 
    this.pointC = p5.Vector.random2D()
    this.pointD = p5.Vector.random2D();
  }

  preload() {

  }

  setPoints() {
    this.pointA = p5.Vector.random2D();
    this.pointA.add([1, 1]);
    this.pointA.div(2);
    this.pointB = p5.Vector.random2D();
    this.pointB.add([1, 1]);
    this.pointB.div(2);
    this.pointC = p5.Vector.random2D();
    this.pointC.add([1, 1]);
    this.pointC.div(2);
    this.pointD = p5.Vector.random2D();
    this.pointD.add([1, 1]);
    this.pointD.div(2);
    // console.log(pointA, pointB, pointC, pointD);
  }

  setColor() {}

  trigger() {
    this.setPoints();
    this.counter = 0.0;
    this.bgTrigger = this.incrementUntil(this.bgTrigger);
  }

  // make a mixin or util
  incrementUntil(val, limit=Math.PI) {
    if (val < limit) {
      val += 0.05;
    } else {
      return 0.0;
    }
    return val;
  }

  draw() {
    if (this.bgTrigger === 0.0) {
      return;
    }
   
    const sk = this.sk;

    this.bgTrigger = this.incrementUntil(this.bgTrigger);
    // (counter < 1.0) ? counter += 0.01 : counter = 1.0;
    this.counter = 1.0;
    const originA = p5.Vector.lerp(this.pointA, this.pointB, this.counter).array();
    const originB = p5.Vector.lerp(this.pointC, this.pointD, this.counter).array();

    this.gradientShader.setUniform('u_time', this.bgTrigger); // this isnt time exactly
    this.gradientShader.setUniform('u_resolution', [this.sk.width, this.sk.height]);
    this.gradientShader.setUniform('u_originA', [originA[0], originA[1]]);
    this.gradientShader.setUniform('u_originB', [originB[0], originB[1]]);
    this.gradientShader.setUniform('u_vector1', this.colorA);
    this.gradientShader.setUniform('u_vector2', this.colorB);

    // CRUCIAL STEP THAT I DONT UNDERSTAND
    this.bgTexture.shader(this.gradientShader);
    this.bgTexture.rect(0, 0, sk.width, sk.height);
    
     /* when you put a texture or shader on an ellipse it is rendered in 3d,
     so a fifth parameter that controls the # vertices in it becomes necessary,
     or else you'll have sharp corners. setting it to 100 is smooth. */
    // let ellipseFidelity = int(map(mouseX, 0, width, 8, 100));
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    
    sk.texture(this.bgTexture);

    sk.rect(0, 0, sk.width, sk.height);
    sk.pop();
  }
}
