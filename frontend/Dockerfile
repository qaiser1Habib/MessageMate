# use official Node.js runtime as a parent image. Alpine Linux is a security-oriented, lightweight Linux distribution based on musl libc and busybox.
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# set environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# build the application
RUN npm run build

# expose the port the app runs on
EXPOSE 5030

# start the application
CMD ["npm", "run", "preview"]