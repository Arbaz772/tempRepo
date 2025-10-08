FROM node:18-bullseye

# create non-root user for safety
RUN groupadd -r appgroup && useradd -r -g appgroup -m arbaz

WORKDIR /usr/src/app

# copy package files first for caching
COPY package*.json ./

# install all dependencies (dev + prod) required for build
RUN npm ci

# copy source files
COPY . .

# ensure server tsconfig exists (you already created it)
# run the build (vite + tsc). This must produce dist/index.js
RUN npm run build

# optional: remove devDependencies to shrink image
# Note: 'npm prune --production' removes devDeps but keeps node_modules present.
RUN npm prune --production

# make sure files are accessible by non-root user
RUN chown -R arbaz:appgroup /usr/src/app

# switch to non-root user
USER arbaz

# expose port
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# start the compiled server (adjust path if your entry is different)
CMD ["node", "dist/index.js"]
