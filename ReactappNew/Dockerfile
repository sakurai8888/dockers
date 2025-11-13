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
FROM nginx:1.29.3 as server

# Copy the built React application files from the builder stage to Nginx's html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./ngnix_conf/ngnix.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]