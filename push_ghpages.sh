#!/usr/bin/env sh

# this script publishes to the github io page of jsAnimation
# https://unjust.github.io/jsAnimation/

# abort on errors
set -e

# build
# TODO figure out prod
yarn run build_js

# navigate into the build output directory
cd build

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:unjust/jsAnimation.git master:gh-pages

cd -
