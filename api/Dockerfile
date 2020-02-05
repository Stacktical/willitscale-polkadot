FROM node:10.16.1-slim

ENV WORKDIR=/var/www/willitscale-api

WORKDIR $WORKDIR

COPY package*.json ./

ENV HOST="0.0.0.0" \
    PORT=10000

RUN npm install pm2 -g \
    && npm install --silent

# Combining ARG end ENV to set the default NODE_ENV
ARG NODE_ENV="development"

ENV NODE_ENV=$NODE_ENV

COPY  . .

RUN chown -R node:node $WORKDIR

USER node

RUN npm run build

EXPOSE $PORT

CMD pm2 start /var/www/willitscale-api/pm2.json --no-daemon --env $NODE_ENV -- \
    --HOST $HOST \
    --PORT $PORT 
