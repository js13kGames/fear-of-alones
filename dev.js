/* eslint-disable */
const http      = require('http');
const url       = require('url');
const fs        = require('fs');
const path      = require('path');
const rollup    = require('rollup');
const eslint    = require('rollup-plugin-eslint');
const uglify    = require('rollup-plugin-uglify-es');
const closure   = require('rollup-plugin-closure-compiler-js');


// Compile with linting and uglify
const compile = (build = false, exit = false) => {
  const rollupPlugins = [
    eslint({
      parserOptions: {
        sourceType: 'module'
      }
    })
  ];

  if (build) rollupPlugins.push(
    closure({compilationLevel: 'ADVANCED_OPTIMIZATIONS', rewritePolyfills: true, assumeFunctionWrapper: true}),
    uglify()
  );

  rollup.rollup({
    entry: 'index.js',
    plugins: rollupPlugins
  }).then(bundle => {
    bundle.write({
      dest: 'index.min.js',
      format: 'iife',
      sourceMap: false//build ? false : 'inline'
    }).then(() => {
      console.log("\x1b[42m" + 'Compiled! :)' + "\x1b[0m");

      if (exit) process.exit();
    });
  }, error => {
    console.log("\x1b[41m" + 'Error! :(' + "\x1b[0m", '\n', error.loc.file, '\n', 'Line: ' + error.loc.line +
    ', column: ' + error.loc.column);

    fs.writeFileSync('./index.min.js', 'document.write(`' + error + '<br>' +
      error.loc.file.replace(/\\/g, '\\\\') + '<br>Line: ' + error.loc.line + ', column: ' +
      error.loc.column + '<br>' + error.frame.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') + '`);');

    if (exit) process.exit();
  });
}

// Prepare server
const server = () => http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;
  const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  };
  fs.exists(pathname, function (exist) {
    if(!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    if (fs.statSync(pathname).isDirectory()) pathname += '/index.html';

    fs.readFile(pathname, function(err, data){
      if (err) res.statusCode = 500, data = `Error getting the file: ${err}.`;
      else res.setHeader('Content-type', mimeType[path.parse(pathname).ext] || 'text/plain' );
      res.end(data);
    });
  });
}).listen(8080) && console.log('Run server on 127.0.0.1:8080');

// Watch files for change to auto compile
const watch = dirName => {
  const except = ['index.min.js', 'index.min.js.map', 'node.js'];
  let isSecond = false; // Hack, becaouse it reads twice

  fs.watch(dirName, { recursive: true }, (eventType, filename) => {
    if (except.includes(filename)) return;

    if (isSecond == true) {
      compile();
      console.log(filename + ' changed!');
    }

    isSecond = !isSecond;
  });
};

// Run
if (process.argv[2]) switch (process.argv[2]) {
case 'server':
  server();
  break;
case 'watch':
  compile();
  watch('./modules/');
  break;
case 'build':
  compile(true, true);
  break;
case 'compile':
  compile(false, true);
  break;
default:
case 'dev':
  compile();
  server();
  watch('./modules/');
  break;
}
