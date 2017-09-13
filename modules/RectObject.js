import GameObject from './GameObject.js';

export default class RectObject extends GameObject {
  constructor (x = 0, y = 0, w = 0, h = 0, color = 'white') {
    super(x, y);

    this.w      = w;
    this.h      = h;
    this.color  = color;
  }

  draw (camera) {
    camera.cx.fillStyle = this.color;
    camera.cx.fillRect(
      (this.x - camera.x) * camera.scale,
      (this.y - camera.y) * camera.scale,
      this.w * camera.scale,
      this.h * camera.scale
    );
  }
}
