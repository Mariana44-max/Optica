FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_AUTH_URL=http://localhost:4001
ARG VITE_PRODUCT_URL=http://localhost:4002
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_PRODUCT_URL=$VITE_PRODUCT_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
