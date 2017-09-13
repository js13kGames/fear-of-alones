import RectObject from './RectObject.js';

export default class Player extends RectObject {
  constructor (x, y) {
    super(x, y, 20, 20, '#f66');
    this.power = 1;
  }
}
