FROM node:18-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apk add --no-cache build-base g++ cairo-dev jpeg-dev pango-dev giflib-dev
RUN apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation fontconfig
COPY package.json .husky-install.config.js /usr/src/app/
RUN yarn install --ignore-engines --immutable --immutable-cache --check-cache
COPY . /usr/src/app/
RUN mkdir -p /usr/src/app/uploads
RUN chown -R node:node /usr/src/app/
RUN chown -R node:node /usr/src/app/uploads/ && chmod -R 777 /usr/src/app/uploads/
