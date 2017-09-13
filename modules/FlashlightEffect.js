import GameObject from './GameObject.js';

export default class FlashlightEffect extends GameObject {
  constructor (x = 0, y = 0, w = 0, h = 0, radius = 0) {
    super(x, y);

    this.w      = w;
    this.h      = h;
    this.radius = radius;

    this.image  = false;
    this.cacheLight();
  }

  cacheLight () {
    const canvas = document.createElement('canvas');
    const cx = canvas.getContext('2d');

    canvas.width  = this.w;
    canvas.height = this.h;

    cx.save();
    cx.clearRect(0, 0, this.w, this.h);
    cx.fillStyle = 'rgba(0, 0, 0, .99)';
    cx.fillRect(0, 0, this.w, this.h);
    cx.globalCompositeOperation = 'destination-out';
    cx.beginPath();

    cx.arc(this.w * .5, this.h * .5, this.radius, 0, Math.PI * 2, false);

    cx.fillStyle = 'none';
    cx.shadowOffsetX = 0;
    cx.shadowOffsetY = 0;
    cx.shadowBlur = 100;
    cx.shadowColor = 'rgba(0, 0, 0, .9)';
    cx.fill();
    cx.restore();

    this.image = canvas;
  }

  draw (camera) {
    if (this.image) camera.cx.drawImage(
      this.image,
      (this.x - camera.x) * camera.scale,
      (this.y - camera.y) * camera.scale,
      this.w * camera.scale,
      this.h * camera.scale
    );
  }
}
