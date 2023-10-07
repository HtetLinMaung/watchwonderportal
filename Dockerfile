# Use the official Node.js image as a parent image
FROM node:lts-alpine3.17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Specify the command to run on container start
CMD [ "npm", "start" ]
