# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy full source
COPY . .

# Run build (creates dist/ folder)
RUN npm run build

# ---- Production stage ----
FROM node:18-alpine AS prod

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary files from build stage
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/client ./client  # if you have static client assets
COPY --from=build /usr/src/app/public ./public  # optional if you serve static files

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
