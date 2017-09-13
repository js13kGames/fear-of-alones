export default class GameObject {
  constructor (x = 0, y = 0) {
    this.x = x;
    this.y = y;

    this.children = new Map();
    this.parent = false;
  }
}
