import Objekt from './Objekt.js';

export default class Cube extends Objekt {

  constructor(
    side,
    x,
    y,
    z,
    colors) {
      super("box", side, side, x, y, z, colors );
  }

};
