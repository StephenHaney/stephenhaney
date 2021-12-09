import posthtml from 'posthtml';
import include from 'posthtml-include';
import md from 'posthtml-md';
import fs from 'fs';

export function buildFile(filePath) {
  if (fs.existsSync('./preview') === false) {
    fs.mkdirSync('./preview');
  }

  fs.readFile(filePath, 'utf8', function (err, html) {
    posthtml([include({ encoding: 'utf8' }), md()])
      .process(html)
      .then((result) => {
        let newPath = './preview/' + filePath.replace('src/', '');

        fs.writeFileSync(newPath, result.html);
        console.log(`Writing new HTML file to: ${newPath}`);
      });
  });
}
