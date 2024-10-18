FROM gcr.io/distroless/nodejs20-debian12
ENV NODE_ENV=production

WORKDIR /app

COPY ./uforetrygd-frontend/next.config.mjs ./
COPY ./uforetrygd-frontend/.next ./.next
COPY ./uforetrygd-frontend/node_modules ./node_modules

ENV PORT=8080

CMD ["./node_modules/next/dist/bin/next", "start"]