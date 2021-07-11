import p5 from 'p5';

new p5((s) => {

  let c1 = s.color('blue');
  let c2 = s.color('red');
  
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  }

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
   
    s.background('black');
  };

  s.update = () => {
    
  };

  s.draw = () => {
    debugger
    for (let x = 0; x < s.width; x++) {
      s.stroke(s.lerpColor(c1, c2, x/100));
      s.line(x, 0, x, s.height);
    }
  };

});