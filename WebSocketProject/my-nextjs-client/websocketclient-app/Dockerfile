# Stage 1: Build the application
# Use Node.js version 20 (LTS) based on the lightweight Alpine Linux
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install all dependencies (including devDependencies needed for the build)
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
# This will now create the .next/standalone directory
EXPOSE 3000
CMD ["npm", "run", "dev"]