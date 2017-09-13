export default class GameWindow {
  constructor (w, h) {
    this.canvas = document.createElement('canvas');
    this.cx = this.canvas.getContext('2d');

    this.canvas.width = w;
    this.canvas.height = h;

    document.body.appendChild(this.canvas);

    for (let prop of
    [ 'msImageSmoothingEnabled',
      'mozImageSmoothingEnabled',
      'webkitImageSmoothingEnabled',
      'imageSmoothingEnabled'
    ]) this.cx[prop] = false;
  }
}
