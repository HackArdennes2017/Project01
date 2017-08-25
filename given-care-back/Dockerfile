FROM node:7.8.0
ARG NODE_ENV=development
ENV NODE_ENV ${NODE_ENV}

# Create app directory
RUN mkdir -p /app
WORKDIR /app


# Install app dependencies
COPY package.json /app/package.json
RUN npm install

# Bundle app source
COPY . /app

EXPOSE 5000
CMD ["npm", "start"]