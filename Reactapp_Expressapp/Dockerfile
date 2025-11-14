# Stage 1: Build the React application
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React application for production
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy npm files and install only production deps (express, compression, etc.)
COPY package.json package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy the production build and the server
COPY --from=builder /app/build ./build
COPY server.js ./server.js

# Optional: drop privileges
RUN addgroup -g 1001 -S nodejs && adduser -S app -u 1001
USER app

EXPOSE 3000
CMD ["node", "server.js"]