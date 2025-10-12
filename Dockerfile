# Stage 1: Build both frontend and backend
FROM node:20-bullseye AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN ls -R dist

# Stage 2: Setup production runtime image
FROM node:20-bullseye

WORKDIR /usr/src/app

# Copy only the built artifacts and production dependencies
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

ENV NODE_ENV=production
ENV PORT=8001
EXPOSE 8001

# create non-root user for safety
RUN groupadd -r appgroup && useradd -r -g appgroup -m arbaz
RUN chown -R arbaz:appgroup /usr/src/app
USER arbaz


CMD ["node", "./dist/server/index.js"]
