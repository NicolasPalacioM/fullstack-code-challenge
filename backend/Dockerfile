# Use the specific base image for Node.js development
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bullseye

WORKDIR /workspaces/myapp/

# Copies package.json and package-lock.json to Docker environment
COPY package*.json .

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y postgresql-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm run build

EXPOSE 3000


