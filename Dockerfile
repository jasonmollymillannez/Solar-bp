# Backend Dockerfile for Blockplanner bp
FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy backend source
COPY backend ./backend

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "backend/src/index.js"]
