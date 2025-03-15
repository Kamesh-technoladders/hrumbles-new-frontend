# ---- Step 1: Build Stage ----
FROM node:18.17.0 AS build

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies first (Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm ci --quiet

# Copy the entire project to the container
COPY . .

# Build the application
RUN npm run build

# ---- Step 2: Production Stage ----
FROM node:18.17.0 AS production

# Install serve to serve the built files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist dist

# Expose port 80 for the app
EXPOSE 80

# Serve the application
CMD ["serve", "-s", "dist", "-l", "80"]
