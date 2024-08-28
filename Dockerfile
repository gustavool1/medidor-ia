
FROM node:16.14.0-alpine 

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add nodemon

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]