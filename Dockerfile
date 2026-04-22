# STAGE 1: The Builder (Isolated Environment)
FROM node:20-bookworm AS builder

# Install the C++ compiler tools needed for sqlite3
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy ONLY the dependency lists (No code yet!)
COPY package*.json ./

# FORCE a fresh build from source specifically for Linux
RUN npm install --build-from-source sqlite3

# STAGE 2: The Final Image
FROM node:20-bookworm-slim

WORKDIR /usr/src/app

# Copy ONLY the fresh Linux-built modules from the builder
COPY --from=builder /build/node_modules ./node_modules

# Copy your source code
COPY . .

# Ensure the path to your index file is correct
CMD [ "node", "src/index.js" ]