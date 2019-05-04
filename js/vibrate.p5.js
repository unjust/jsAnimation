import p5 from "p5";
import "p5/lib/addons/p5.sound";

class VibrateShape {
  MAX_VIBES = 20;
  x;
  y;
  x0;
  y0;
  x1;
  y1;
  size;
  vibrations = [];

  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.x0 = x;
    this.x1 = x;
    this.y0 = y;
    this.y1 = this.y0 + 5;
    this.size = size;
  }

  addVibe() {
    this.vibrations.push(this.size);
  }

  update(sk, isOverThreshold) {
    if (isOverThreshold) {
      this.addVibe();
      this.y = sk.lerp(this.y0, this.y1, .1);
    } else {
      this.y = sk.lerp(this.y1, this.y0, .1);
    }
    this.x = this.x0 + Math.sin(sk.millis() / 1000) * 50;
    if (this.vibrations[this.vibrations.length - 1] > 200) {
      this.vibrations.shift();
    }
  }
  
  createShape(sk, size) {
    // calculate size for sphere
    // calculate size for triangle
    
    let hyp = ((this.x) / 2) / Math.cos(30);
    let half_tri_height = Math.pow(hyp) - Math.pow(this.x / 2, 2);

    const half_size = size / 2;

    sk.beginShape();
      sk.vertex(this.x - half_size, this.y - half_size);
      sk.vertex(this.x, this.y + half_size);
      sk.vertex(this.x + half_size, this.y - half_size);
    sk.endShape();
  }

  draw(sk) {
    sk.noFill();

    const vibesCount = this.vibrations.length;
    for (let v = 0; v < vibesCount; v++) {
      const m = v;
      //var newval=(n-start1)/(stop1-start1)*(stop2-start2)+start2;if(!withinBounds){return newval;}if(start2<stop2){return this.constrain(newval,start2,stop2);}else{return this.constrain(newval,stop2,start2);}};
      sk.map(m, 0, vibesCount, 0, 100);
      sk.stroke(sk.color(0, 100/m));
      const r = this.vibrations[v] + (1 * v);
      this.vibrations[v] = r;
      sk.ellipse(this.x, this.y, r);
    }
    sk.stroke(0);
    sk.fill(255);
    sk.ellipse(this.x, this.y, this.size - 20);
    // this.createShape(sk, this.size - 20);
  }

};

new p5((sk) => {
  let vs, 
    input, 
    mLevel,
    fft;

  const threshold = 0.05;

  const drawSpectrum = () => {
    let spectrum = fft.analyze();
    
    sk.beginShape();
    for (let i = 0; i < spectrum.length; i++) {
      sk.vertex(i, sk.map(spectrum[i], 0, 255, sk.height, 0));
    }
    sk.endShape()
  };

  const isOverThreshold = (level) => (level > threshold);

  sk.setup = () => {
    sk.createCanvas(sk.displayWidth - 200, sk.displayHeight - 200, sk.WEB_GL);
    vs = new VibrateShape(sk.width / 2, sk.height / 2, 100);

    input = new p5.AudioIn();
    input.start();

    fft = new p5.FFT();
    fft.setInput(input);
  }

  sk.draw = () => {
    sk.background(100);
    // drawSpectrum();
    
    // sk.translate(-sk.width/2, -sk.height/2);
    mLevel = input.getLevel();

    // console.log(mLevel);
    vs.update(sk, isOverThreshold(mLevel));
    vs.draw(sk);
  }
});
