const posthtml = require('posthtml');
const include = require('posthtml-include');

const html = `
  <div><include src="src/index.html" /></div>
`;

posthtml([include({ encoding: 'utf8' })])
  .process(html)
  .then((result) => console.log(result.html));
