import Objekt from './Objekt.js';

export default class Cube extends Objekt {

  constructor(
    sketch,
    { 
      w,
      h,
      x,
      y,
      z
    },
    colors) {
      super(sketch, "box", { w, h, x, y, z }, colors );
  }

};
