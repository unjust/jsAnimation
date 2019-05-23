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
    this.y1 = y;
    this.size = size;
  }

  addVibe() {
    this.vibrations.push({ size: this.size + 20, opacity: 100 });
  }

  bounce(sk) {
    if (this.y >= this.y1) {
      this.y = sk.lerp(this.y0, this.y1, .1);
    } else {
      this.y = sk.lerp(this.y1, this.y0, .1);
    }
  }

  pace(millis) {
    this.x = this.x0 + Math.sin( millis / 1000) * 50;
  }

  update(sk, isOverThreshold, levelDiff) {
    // console.log(isOverThreshold, levelDiff);
    if (isOverThreshold) {
      this.addVibe();

      const bounceLevel = this.y - (2000 * levelDiff);
      this.y1 = sk.constrain(bounceLevel, this.y0 - 400, this.y0);
    }
    
    this.bounce(sk);
    this.pace(sk.millis());
    
    const vibesCount = this.vibrations.length;
    if (vibesCount && this.vibrations[vibesCount - 1].opacity < 1) {
      this.vibrations.shift();
    }
  }
  
  createShape(sk, size) {
    // calculate size for triangle
    
    const rad_30 = sk.radians(30);
    const rad_60 = sk.radians(60);
    let y_height_1 = Math.sin(rad_30) * (size / Math.sin(rad_60));

    const half_size = size / 2;
    let hypoteneuse = half_size / Math.cos(rad_30);
    let y_height_2 = Math.sqrt((Math.pow(hypoteneuse, 2) - Math.pow(half_size, 2)));
    
    sk.beginShape();
    sk.vertex(this.x - half_size, this.y + y_height_2);
    sk.vertex(this.x, this.y - y_height_1);
    sk.vertex(this.x + half_size, this.y + y_height_2);
    sk.endShape(sk.CLOSE);
    // sk.ellipse(this.x, this.y, 2);
  }

  draw(sk) {
    sk.noFill();

    const vibesCount = this.vibrations.length;
    for (let i = 0, pos = 1; i < vibesCount; i++, pos++) {
      const v = this.vibrations[i];
      sk.stroke(sk.color(0, v.opacity));
      this.createShape(sk, v.size);
      v.size = v.size + ((vibesCount / pos) * 5);
      v.opacity = v.opacity - 5;
    }
  
    sk.stroke(0);
    sk.fill(255);
    // sk.ellipse(this.x, this.y, this.size - 20);
    this.createShape(sk, this.size);
  }

};

new p5((sk) => {
  let vs, 
    input, 
    mLevel,
    fft;

  const threshold = 0.03;

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
    vs = new VibrateShape(sk.width / 2, sk.height / 2, 200);

    input = new p5.AudioIn();
    input.start();

    fft = new p5.FFT();
    fft.setInput(input);
  }

  sk.draw = () => {
    sk.background(100);
    // drawSpectrum();

    mLevel = input.getLevel();

    // console.log(mLevel);
    vs.update(sk, isOverThreshold(mLevel), mLevel - threshold);
    vs.draw(sk);
  }
});
