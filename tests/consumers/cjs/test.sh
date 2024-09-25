rm -rf node_modules 
rm -rf package-lock.json

npm unlink axe-api
npm link axe-api

# npm install
pwd
node index.js

npm unlink axe-api