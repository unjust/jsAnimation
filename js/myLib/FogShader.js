import p5 from 'p5';

export class FogShader {
  
  constructor(sk, vert='shaders/standard.vert', frag='shaders/fog.frag') {
    // for gradient clouds
    this.shader = sk.loadShader(vert, frag);
    this.bgTexture = sk.createGraphics(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    this.bgTexture.noStroke();
    //this.bgTexture._renderer.drawingContext.disable(this.bgTexture._renderer.drawingContext.DEPTH_TEST);
    
    this.sk = sk;

    this.colorVector = new p5.Vector(0., 0., 0.);
  }

  preload() {

  }

  setColor(colorArray) {
    this.colorVector = new p5.Vector(...colorArray);
  }

  draw() {
    const sk = this.sk;
    this.bgTexture.clear();
    this.shader.setUniform('u_resolution', [sk.width, sk.height]);
    this.shader.setUniform('u_colorVector', [this.colorVector.x, this.colorVector.y, this.colorVector.z]);
    // this.shader.setUniform('u_value', v);
    this.shader.setUniform('u_time', sk.millis()/3);

    // CRUCIAL STEP THAT I DONT UNDERSTAND
    this.bgTexture.shader(this.shader);
    this.bgTexture.rect(0, 0, sk.width, sk.height);
    sk.blendMode(sk.SCREEN);
  
    sk.push();
    sk.translate(-sk.width/2, -sk.height/2);
    
    sk.texture(this.bgTexture);
    sk.rect(0, 0, sk.width, sk.height);
    sk.pop();
  };

}


