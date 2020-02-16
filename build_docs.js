
const ghpages = require('gh-pages');
const dotenv = require('dotenv');
dotenv.config();

ghpages.publish('build/js', {
  repo: `https://${process.env.GH_TOKEN}@github.com/unjust/unjustio.git`,
  src: '*.*js',
  dest: 'assets/javascript/animation'
}, (e) => {
  console.log("done. error: ", e);
});
