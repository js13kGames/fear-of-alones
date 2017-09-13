export default class FixedLoop {
  constructor (update, start = true, freq = .02) {
    this.lastTime = Date.now();
    this.update   = update;
    this.freq     = freq;
    this._pause   = !start;
    this.id       = setInterval(() => this.loop(Date.now()), 0);
  }

  loop (time) {
    let queued = (time - this.lastTime) * this.freq;

    if (queued < 1) return;

    this.lastTime = time;

    while (--queued >= 0) if (!this._pause) this.update();
  }

  pause (change = null) {
    if (change === true || change === false) this._pause = change;
    return this._pause;
  }

  stop () {
    clearInterval(this.id);
  }
}
