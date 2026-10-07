# Development image. Source is bind-mounted by docker-compose.yml.
FROM node:24-alpine

WORKDIR /app

# Install dependencies first so this layer is cached until package files change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
