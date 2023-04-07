FROM node:18

WORKDIR ~/svinge

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9090

CMD ["node", "dist/server.js"]