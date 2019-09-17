# Create image based on the official Node 11 image from dockerhub
FROM node:11

# Create app directory
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies + nodemon
RUN npm install
RUN npm install nodemon -g

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
EXPOSE 3000

CMD ["nodemon", "-L", "index.js"]