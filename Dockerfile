# FROM node:20-alpine AS base
FROM node:18-alpine

WORKDIR /app

COPY . .

# RUN yarn install --production
# RUN yarn install --check-files
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]