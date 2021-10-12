
export const drawCoordinates = (sk, isWebGL=true) => {
  sk.stroke(220);
  sk.beginShape();
  if (isWebGL) {
    sk.vertex(0, -sk.height/2);
    sk.vertex(0, sk.height/2);
  }
  sk.endShape();
  sk.beginShape();
  if (isWebGL) {
    sk.vertex(-sk.width/2, 0);
    sk.vertex(sk.width/2, 0);
  }
  sk.endShape();
}

export const displayCoordinates = (mouseX, mouseY) => {
  console.log(`coordinates: ${mouseX}, ${mouseY}`);
}
