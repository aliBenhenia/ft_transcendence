FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including .env)
COPY . .

# Build the Next.js application for production
# RUN npm run build

# Check if build output exists in .next directory
# RUN ls -l .next
# ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the app in production mode
# CMD ["npm", "run", "start"]
# start the app in development mode
CMD ["npm", "run", "dev"]
