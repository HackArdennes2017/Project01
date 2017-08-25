#/bin/sh

# clean up
rm -rf www
rm -rf .git

# cd to project root
cd ..

# clean up and build
npm install
ionic build browser

# mv build result ('./dist') to dokku-deploy folder
mv ./platforms/browser/www ./dokku-deploy/

# return to dokku-deploy folder
cd ./dokku-deploy

# git stuffs
git init
cd www
git add -f *
cd ..
git add -f Dockerfile
git commit -m "dokku deploy"

# push to Dokku
git push --force ssh://dokku@dokku.intech-lab.com/given-care-mobile master

# rm git setup
rm -rf .git
rm -rf www
