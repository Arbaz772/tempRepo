# Dockerfile (multi-stage: build on Debian, prod on slim)
FROM node:18-bullseye AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/client ./client
COPY --from=build /usr/src/app/shared ./shared
EXPOSE 3000
CMD ["node","dist/index.js"]