export const drawCoords = (sk) => {
  sk.push();
  sk.stroke(155);
  sk.line(-sk.width/2, 0, sk.width/2, 0); // x
  sk.line(0, -sk.height/2, 0, sk.height/2);
  sk.pop();
}
