FROM node:23

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Compile TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
