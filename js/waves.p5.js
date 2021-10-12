import p5 from 'p5';

// gracias jared https://www.youtube.com/watch?v=okfZRl4Xw-c&ab_channel=TheCodingTrain
const containerEl = document.querySelector("#animation-container");


class Wave {
  constructor(amp, period, phase) {
    this.amp = amp;
    this.period = period;
    this.phase = phase;
    this.phaseRate = Math.random();
  }
  calculate(x) {
    return Math.sin(this.phase + (Math.PI * 2) * x / this.period) * this.amp/2;
  }
  update() {
    this.phase += this.phaseRate/10;
  }
}

new p5((sk) => {
  const angles = [];
  const waveHistory = [];
  const waveHistoryMax = 15;
  let total;
  const r = 3;
  const angleV = [];
  const waves = [];

  sk.setup = () => {
    sk.createCanvas(600, 400, sk.WEBGL);
    console.info('a wave suns but leaves a trail of history that fades')
    total = Math.floor(sk.width / (r * 2));
    for (let i = 0; i < total; i++) {
      angles[i] = sk.map(i, 0, total, 0, 2 * sk.TWO_PI);
      angleV[i] = 0.01 + i / 100;
    }
    for (let w = 0; w < 5; w++) {
      waves.push(new Wave(
        sk.random(20, sk.height/4),
        sk.random(100, sk.width/2),
        sk.random(0, 2 * Math.PI))
      );
    }
  };

  sk.windowResized = () => {
    sk.resizeCanvas(containerEl.clientWidth, containerEl.clientHeight);
  }

  const pushWave = (wave) => {
    if (waveHistory.length > waveHistoryMax) {
      waveHistory.shift();
    }
    waveHistory.push(wave);
  }

  sk.draw = () => {
    sk.clear();
    sk.background(0);
    sk.translate(-sk.width/2, 0);
    sk.stroke(255, 255, 255);
    sk.strokeWeight(1);
    
    sk.noFill();
    // for (let i = 0; i < angles.length; i++) {
    //   //sk.push();
    //   //sk.translate(i * (r * 2), 0);
    //   const y = sk.map(Math.sin(angles[i]), -1, 1, -sk.height/2, sk.height/2);
    //   //sk.circle(i * r * 2, y, r*2);
    //   sk.vertex(i * r * 2, y);
    //   //sk.pop();
    //   // angles[i] += angleV[i];
    //   angles[i] += 0.02;
    // }

    sk.beginShape();
    const tempWave = [];
    for (let x = 0; x < sk.width; x+=10) {
      let y = 0;
      for (let wave of waves) {
        y += wave.calculate(x);
        //sk.circle(x, y, r * 2);
      }
      sk.vertex(x, y);
      tempWave.push([x, y])
    }
    sk.endShape();
    pushWave(tempWave);

    for (let w = 0; w < waveHistory.length; w++) {
      const color = `rgba(255,255,255,${1/w})`;
      //  
      sk.stroke(color);
      sk.beginShape();
        for (let v = 0; v < waveHistory[w].length; v++) {
          const [x, y] = waveHistory[w][v];
          sk.vertex(x, y);
        }
      sk.endShape();
    }

    for (let wave of waves) {
      wave.update();
    }
  };
}, containerEl);
