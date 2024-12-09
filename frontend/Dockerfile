# Use node LTS
FROM node:18

# Install dependencies
WORKDIR /app
COPY package.json ./
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 5173

# NPM dev
CMD ["npm", "run", "dev"]

# Start the app using the Express server
# CMD ["node", "server.cjs"]
