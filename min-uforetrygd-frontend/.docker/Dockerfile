FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22
ENV NODE_ENV=production

WORKDIR /app

COPY ./din-uforetrygd-frontend/next.config.mjs ./
COPY ./din-uforetrygd-frontend/.next ./.next
COPY ./din-uforetrygd-frontend/node_modules ./node_modules
COPY ./din-uforetrygd-frontend/dist ./server

ENV PORT=8080

CMD ["server/server.js"]
