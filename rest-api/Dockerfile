FROM node:11

# Install node packages
COPY /package.json /usr/src/app/package.json
COPY /api/static /usr/src/app/api/static
WORKDIR /usr/src/app
RUN npm install
