# Use the official Node.js 18 image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

ENV NEXT_PUBLIC_API_URL=http://localhost:9003


# Build the Next.js application for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start"]