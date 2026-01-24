# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (better for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your server code
COPY . .

# Expose the port your server runs on (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]