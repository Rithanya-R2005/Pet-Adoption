# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY server/ .

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]