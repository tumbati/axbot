FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./

# If you are building your code for production
# RUN npm ci --omit=dev

COPY . .

RUN npm install
RUN npm run build

EXPOSE 5000

CMD [ "npm", "start" ]