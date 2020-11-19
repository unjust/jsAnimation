# to tryout the jekyll process locally

yarn build_js
mkdir -p assets/animation
mv build/* assets/animation
mv assets/* ~/Projects/Web/jekyll/unjustio/build/assets/
rm -r assets
