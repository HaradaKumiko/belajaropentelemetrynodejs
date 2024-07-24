FROM node:18.16.1 
LABEL MAINTAINER="Farhan Rivaldy <fariv.fariv12@gmail.com>"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install Package Manager
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]