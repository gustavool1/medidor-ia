
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn global add nodemon

RUN yarn global add typescript

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "dev" ]