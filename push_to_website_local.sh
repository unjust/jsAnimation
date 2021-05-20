# to tryout the jekyll process locally

yarn build_js
BRANCH_NAME=$(git branch --show-current)
DIR_NAME=tmp/${BRANCH_NAME}
mkdir -p $DIR_NAME
mv build/* $DIR_NAME
echo "will move $DIR_NAME to jekyll project assets/animation"
rsync -a tmp/ ~/Projects/Web/jekyll/unjustio/build/assets/animation/
rm -r tmp
