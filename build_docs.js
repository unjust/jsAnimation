
/**
 * uses gh-pages 
 * push babel/webpack compiled animation js to unjustio
 * to build individual project pages
 * run with LOCAL=true to build locally (done via remote local_docs)
 */

const ghpages = require('gh-pages');
const dotenv = require('dotenv');

dotenv.config();

const local = process.env.LOCAL 

const opts = {
  src: '*.*js',
  dest: 'assets/javascript/animation'
}

console.log(local);

if (local) {
  opts.remote = 'local_docs';
} else {
  opts.repo = `https://${process.env.GH_TOKEN}@github.com/unjust/unjustio.git`;
}

ghpages.publish('build/js', opts, (e) => {
  console.log(`ghpages callback done. ${ local ? 'local push' : '' } ${e ? `error: ${e}` : '' }`);
});
