import GameWindow from './GameWindow.js';
import Camera from './Camera.js';
import FixedLoop from './FixedLoop.js';
import Player from './Player.js';
import Inputs from './Inputs.js';
import RectObject from './RectObject.js';
import FlashlightEffect from './FlashlightEffect.js';
// import _DATA_ from './data.js';

export default class Game {
  constructor () {
    this.window = new GameWindow(1280, 720);

    this.loop = false;
    this.objects = [];

    this.selected = false;
    this.moveList = [];

    this.camera = new Camera(this.window.cx, {x: 0, y: 0, w: 1280, h: 720, scale: 1});

    this.generate();

    this.update();
    this.loop = new FixedLoop(() => {
      this.fixedUpdate();
    }, true, .3);

    this.inputs = new Inputs((s, a) => s ? this.startAction(a) : this.stopAction(a));
  }

  update () {
    this.camera.drawFrame(this.objects);

    requestAnimationFrame(() => this.update());
  }

  fixedUpdate () {
    if (this.loop.pause()) return;
    if (!this.selected && this.moveList.length == 1) this.selected = this.moveList[0];
    if (!this.selected) return;

    if (this.selected == 'U') this.player.y--, this.light.y--;
    else if (this.selected == 'D') this.player.y++, this.light.y++;
    else if (this.selected == 'L') this.player.x--, this.light.x--;
    else if (this.selected == 'R') this.player.x++, this.light.x++;

    if (this.player.x % 20 == 0 && this.player.y % 20 == 0 ) {
      // const obj = this.objects.filter(e => e.x == this.player.x && e.y == this.player.y)
      //   .filter(o => !(o instanceof Player) && o.l == this.player.l);

      // if (obj.length) {
      //   if (this.selected == 'U') this.player.y += 8, this.camera.y += 8;
      //   else if (this.selected == 'D') this.player.y -= 8, this.camera.y -= 8;
      //   else if (this.selected == 'L') this.player.x += 8, this.camera.x += 8;
      //   else if (this.selected == 'R') this.player.x -= 8, this.camera.x -= 8;
      // }
      if (this.selected != this.moveList[0]) this.selected = this.moveList[0];
      if (this.moveList.findIndex(e => e == this.selected) == -1) this.selected = false;
    }
  }

  startAction (a) {
    switch (a) {
    case 'U':
    case 'D':
    case 'L':
    case 'R':
      this.moveList.unshift(a);
      break;
    case 'A':
      if (this.dialog && this.dialog.data[this.dialog.option].do()) {
        this.loop.pause(false);
        this.dialog = false;
      }
      break;
    case 'B':
      if (this.dialog) {
        this.loop.pause(false);
        this.dialog = false;
      }
      break;
    }
  }

  stopAction (a) {
    this.moveList = this.moveList.filter(i => i != a);
  }

  generate () {
    const w = 64, h = 36, t = [], ta = [];

    for (let i = 0; i < w; i++) {
      t[i] = [];
      ta[i] = [];
      for (let j = 0; j < w; j++) t[i][j] = 0;
    }

    let l = 0;

    const gen = (x, y, z = false) => {
      if (x < 0 || y < 0 || x >= w || y >= h) return;

      if (z) t[x][y] = 2;

      const dir = Math.random() * 4 | 0;
      let len = Math.random() * 8 | 0 + 5;

      while (len--) {
        l++;

        if (!t[x][y]) t[x][y] = 1;

        x += dir > 1 ? (dir % 2 ? 1 : -1) : 0;
        y += dir < 2 ? (dir % 2 ? 1 : -1) : 0;

        if (x < 0 || y < 0 || x >= w || y >= h) return;

        if (len > 2 && len % 2 && t[x][y] != 1 && Math.random() > .9) gen (x, y);
      }

      if (l < 900) gen (x, y, z ? Math.random() > .9 | 0 : Math.random() > .9 | 0);
    };

    while (l < 900) gen (Math.random() * w | 0, Math.random() * h | 0, true);

    for (let i = 0; i < w; i++) for (let j = 0; j < w; j++) this.objects.push(
      ta[i][j] = new RectObject(i * 20, j * 20, 20, 20, t[i][j] == 2 ? '#fff' : t[i][j] ? '#555' : '#333')
    );


    let x, y;
    while (!this.player) {
      x = Math.random() * w | 0, y = Math.random() * h | 0;

      if (t[x][y] > 0) this.player = new Player(x * 20, y * 20);
    }
    this.objects.push(this.player);
    this.light = new FlashlightEffect(x * 20 - 1490, y * 20 - 1490, 3000, 3000, 40);
    this.objects.push( this.light );
  }

}
