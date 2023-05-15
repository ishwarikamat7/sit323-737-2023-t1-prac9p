# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which your application listens
EXPOSE 3000

# Define the health check
HEALTHCHECK --interval=30s --timeout=5s CMD curl --fail http://localhost:3000/health || exit 1

# Set the command to run your Node.js application
CMD [ "node", "server.js" ]
