export default class Inputs {
  constructor (c) {
    const keys = {
      38: {'key': 'U', 'down': false},
      40: {'key': 'D', 'down': false},
      37: {'key': 'L', 'down': false},
      39: {'key': 'R', 'down': false}
    };

    document.addEventListener('keydown', e => {
      const a = keys[e.keyCode ? e.keyCode : e.which];

      if (a && !a.down) c(a.down = true, a.key);
    }, false);

    document.addEventListener('keyup', e => {
      const a = keys[e.keyCode ? e.keyCode : e.which];

      if (a && a.down) c(a.down = false, a.key);
    }, false);

    let down = false;
    document.querySelector('#c').addEventListener('mousedown', e => {
      down = true;
      e.preventDefault();
      const {top, left} = e.target.getBoundingClientRect(), clientX = e.clientX, clientY = e.clientY;
      const [b, nX, nY] = [30, clientX - left - 100, clientY - top - 100];

      let no = false;
      if (nX < 0 && Math.abs(nY) < b) no = 37;
      if (nX > 0 && Math.abs(nY) < b) no = 39;
      if (nY < 0 && Math.abs(nX) < b) no = 38;
      if (nY > 0 && Math.abs(nX) < b) no = 40;

      if (no) {
        const a = keys[no];

        if (a && !a.down) c(a.down = true, a.key);
      }
    }, false);

    document.querySelector('#c').addEventListener('mouseup', () => {
      down = false;
      const directions = [37, 38, 39, 40];
      for (let direction of directions) {
        const a = keys[direction];

        if (a && a.down) c(a.down = false, a.key);
      }
    }, false);

    document.querySelector('#c').addEventListener('mousemove', e => {
      if (!down) return;
      const {top, left} = e.target.getBoundingClientRect(), clientX = e.clientX, clientY = e.clientY;
      const [b, nX, nY] = [30, clientX - left - 100, clientY - top - 100];

      let no = false;
      if (nX < 0 && Math.abs(nY) < b) no = 37;
      if (nX > 0 && Math.abs(nY) < b) no = 39;
      if (nY < 0 && Math.abs(nX) < b) no = 38;
      if (nY > 0 && Math.abs(nX) < b) no = 40;

      if (no && keys[no] && !keys[no].down) {
        const directions = [37, 38, 39, 40];
        for (let direction of directions) {
          const a = keys[direction];

          if (a && a.down) c(a.down = false, a.key);
        }

        c(keys[no].down = true, keys[no].key);
      }
    }, false);
  }
}
