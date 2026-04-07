FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies deterministically
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
