import AudioDetect, { AudioDraw } from 'Utils/AudioDetect.js';
import p5 from "p5";

const containerEl = document.querySelector('#container');
let viewWidth, viewHeight = 0;
new p5((sk) => {
  sk.setup = () => {
    sk.pixelDensity(1);
    sk.createCanvas(1000, 600, sk.WEBGL);

    sk.background('white');
    viewWidth = sk.width;
    viewHeight = sk.height;
    AudioDetect.init();
  };

  sk.draw = () => {
    sk.clear();
    sk.background(255);
    sk.noFill();
    AudioDetect.updateAudio();

    sk.box(10, 10, 0, 0);
    // morphing blob of color
    // mesh

    // const rects = AudioDraw.p5.drawData(AudioDetect.getFrequencyData(), viewWidth, viewHeight, sk);
    // sk.push()
    // sk.translate(-sk.width/2, -sk.height/2);
    // rects.forEach(r => {
    //   // console.log(r[0].x, r[0].y, r[1].x, r[1].y);// x y w h
    //   sk.rect(r[0].x, r[0].y, r[1].x, r[1].y * -1)
    // });

    const verts = AudioDraw.p5.drawData(AudioDetect.getFrequencyData(), viewWidth, viewHeight, sk);
    sk.push()
    sk.translate(-sk.width/2, -sk.height/2);

    sk.beginShape();
    verts.forEach(v => {
      // console.log(r[0].x, r[0].y, r[1].x, r[1].y);// x y w h
      sk.vertex(v[0].x, v[0].y - v[1].y);
    });
    // sk.vertex(sk.width, sk.height);
    // sk.vertex(0, sk.height);
    sk.endShape();
    sk.pop()
    // AudioDetect.drawFFT(viewWidth, viewHeight);
  }
}, containerEl);
