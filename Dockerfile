FROM node:20.8.1-alpine

# Create app directory
# WORKDIR /usr/src/app
WORKDIR /home/node/app

# ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# ENV PATH=$PATH:/home/node/.npm-global/bin # optionally if you want to run npm global bin without specifying path

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm rebuild bcrypt
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./ ./

CMD [ "npm", "run", "dev-docker" ]