FROM node:11

# Install node packages
COPY /package.json /usr/src/app/package.json
COPY /static /usr/src/app/static
WORKDIR /usr/src/app
RUN npm install