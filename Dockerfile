FROM node:10-alpine

WORKDIR /user/app

COPY package.json .
COPY package-lock.json .
RUN npm install --no-scripts

WORKDIR /user/app/shared
COPY shared/package.json .
COPY shared/package-lock.json .
RUN npm install

WORKDIR /user/app/server
COPY server/package.json .
COPY server/package-lock.json .
RUN npm install

WORKDIR /user/app/admin
COPY admin/package.json .
COPY admin/package-lock.json .
RUN npm install

WORKDIR /user/app/client
COPY client/package.json .
COPY client/package-lock.json .
RUN npm install

WORKDIR /user/app

# Bundle app source
COPY . .
RUN npm run build

EXPOSE 8000

CMD npm start
