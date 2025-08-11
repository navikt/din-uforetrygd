FROM gcr.io/distroless/nodejs20-debian12
ENV NODE_ENV=production

WORKDIR /app

COPY ./uforetrygd-frontend/next.config.mjs ./
COPY ./uforetrygd-frontend/.next ./.next
COPY ./uforetrygd-frontend/node_modules ./node_modules
COPY ./uforetrygd-frontend/dist ./server

ENV PORT=8080

CMD ["server/server.js"]
