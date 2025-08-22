# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json bun.lockb* ./
COPY . .

RUN npm ci && npm run build

# --- nginx stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
