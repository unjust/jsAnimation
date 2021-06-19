# abort on errors
set -e
# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f origin HEAD:unjustio_website_assets
