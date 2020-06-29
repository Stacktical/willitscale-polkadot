# Build Stage
FROM node:10.16.1 as build-stage

ENV WORKDIR=/var/www/willitscale-client \
    PORT=9999

WORKDIR $WORKDIR

COPY package*.json ./

# npm install must run before NODE_ENV deplaration
RUN npm install --silent

ARG NODE_ENV="development"
ENV NODE_ENV=$NODE_ENV

COPY . .

RUN npm run build -- --mode $NODE_ENV

# Production Stage
FROM nginx:1.19.0 as production-stage

ENV PORT=9999

COPY --from=build-stage /var/www/willitscale-client/dist /var/www/willitscale-client/public/dist
#COPY ops/nginx.conf_base /etc/nginx/nginx.conf
ADD conf/nginx.conf /etc/nginx/conf.d/

RUN chown nginx:nginx /var/www/willitscale-client/public/dist

EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]
