# Use node LTS
FROM node:18

# Create app directory
WORKDIR /app

# COPY package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY src ./src
COPY server.js ./

# Expose port 4000
EXPOSE 4000

# Start the app
CMD [ "node", "server.js" ]