import Objekt from './Objekt.js';

export default class Cube extends Objekt {

  constructor(
    sketch,
    { 
      side,
      x,
      y,
      z
    },
    colors) {
      super(sketch, "box", { w: side, h: side, x, y, z }, colors );
  }

};
