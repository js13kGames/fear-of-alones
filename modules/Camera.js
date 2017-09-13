export default class Camera {
  constructor (context, options) {
    this.cx = context;
    this.x = options.x;
    this.y = options.y;
    this.w = options.w;
    this.h = options.h;
    this.scale = options.scale;
  }

  drawFrame (objects) {
    this.cx.clearRect(0, 0, this.w * this.scale, this.h * this.scale);
    for (let o of objects) o.draw(this);
  }
}
