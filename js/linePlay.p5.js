import p5 from 'p5';

new p5((sk) => {
  let canvasHeight,
    canvasWidth;

  let segmentPoints = 4,
    segmentVerts = [],
    counter = 0;

  let isCurved = false;

  let lineSpacing = 20;

  sk.setup = () => {
    sk.createCanvas(400, 400, sk.WEBGL);
    canvasHeight = sk.height;
    canvasWidth = sk.width;
    sk.background('white');
    chooseVertices();
  };

  const chooseVertices = () => {
    for (let i = 0; i <= segmentPoints; i++) {
      segmentVerts.push([canvasWidth/segmentPoints * i, 0]);
    }
  };

  const segmentMotion = (counter) => {
    segmentVerts.forEach((v, i) => {
      const sinSeed = counter + (i + i % 10) * 100;
      const sinHeight = Math.sin(sinSeed / 200);
      const dy = Math.sin(sinSeed / 100) * sinHeight * lineSpacing * 5;
      // const dy = Math.sin(sinSeed / 200) * (lineSpacing * 5);
      v[1] = dy;
    });
  }
  
  sk.mouseClicked = () => {
    isCurved = !!isCurved;
  }

  sk.draw = () => {
    sk.background(255);
    counter += .1;
    segmentMotion(counter);

    sk.push();
    sk.translate(-canvasWidth/2, -canvasHeight/2);
    
    for (let y = 0; 
        y < canvasHeight - (lineSpacing * 3);
        y += lineSpacing) {
      segmentVerts.forEach((v, i, arr) => {
        sk.beginShape(sk.LINES);
        sk.vertex(v[0], y + v[1]);
        if (arr[i + 1]) {
          const v2 = arr[i + 1];
          sk.vertex(v2[0], y + v2[1]);
        }
        sk.endShape();
      });
    }
    sk.pop();
  };
});
