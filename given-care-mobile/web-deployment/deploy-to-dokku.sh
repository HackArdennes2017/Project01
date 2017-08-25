#/bin/sh

# clean up
rm -rf www
rm -rf .git

# cd to project root
cd ..

# clean up and build
npm install
ionic cordova build browser

# mv build result ('./dist') to dokku-deploy folder
mv ./platforms/browser/www ./web-deployment/

# return to dokku-deploy folder
cd ./web-deployment

# git stuffs
git init
cd www
git add -f *
cd ..
git add -f ./Dockerfile
git commit -m "dokku deploy"

# push to Dokku
git push --force ssh://dokku@team01.hackardennes.com/given-care-mobile master

# rm git setup
rm -rf .git
rm -rf www
