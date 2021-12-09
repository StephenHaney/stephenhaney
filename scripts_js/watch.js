import * as chokidar from 'chokidar';
import { buildFile } from './build.js';

// One-liner for current directory
chokidar.watch('./src').on('all', (event, path) => {
  console.log(event, path);

  if (path.includes('.html')) {
    buildFile(path);
  }
});
