# ---- Stage 1: Build the Vite App ----
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
    