FROM node:16.17-alpine

RUN mkdir -p /home/app && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node

RUN npm i
RUN npm run build

EXPOSE 3000
EXPOSE 8000
CMD ["npm", "start"]
