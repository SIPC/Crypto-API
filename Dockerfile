FROM node:21-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:21-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY index.js lib.js ./
EXPOSE 3000
CMD ["node", "index.js"]
