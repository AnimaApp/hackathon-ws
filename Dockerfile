FROM node:16

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
RUN yarn build

EXPOSE 10000
CMD [ "yarn", "start" ]