FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci && \
    npm cache clean --force

COPY . .

RUN npm run prebuild && npm run build

RUN npm run test:run || true

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

COPY --from=builder /app/build ./build
COPY --from=builder /app/logs ./logs
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["npm", "run", "serve"]
