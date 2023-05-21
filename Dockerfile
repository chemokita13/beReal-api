FROM node:latest

WORKDIR /app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]