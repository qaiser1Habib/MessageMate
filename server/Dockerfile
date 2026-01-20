# use official Node.js runtime image which give all required tools and libraries.
FROM node:20-alpine

# create a folder where the app code will be stored
WORKDIR /app

# install build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the application code
COPY . .

# expose the port the app runs on
EXPOSE 5010

# start the application
CMD ["npm", "start"]


