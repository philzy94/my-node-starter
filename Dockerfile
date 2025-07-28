# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 4000

# Start the server
CMD ["node", "dist/main.js"]
