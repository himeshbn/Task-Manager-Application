# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy full source and build
COPY . .
RUN npm run build

# Stage 2: Serve the Static Output
FROM node:20-alpine

WORKDIR /app

# Install 'serve' globally to host static files
RUN npm install -g serve

# Copy ONLY the built 'dist' folder from Stage 1
COPY --from=build /app/dist ./dist

# Expose frontend port
EXPOSE 3000

# Start SPA server with sub-routing support (-s)
CMD ["serve", "-s", "dist", "-l", "3000"]
