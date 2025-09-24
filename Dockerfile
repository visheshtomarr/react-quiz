# Step 1: Build the React application
FROM node:18-alpine3.18 as build
WORKDIR /react-quiz
COPY package.json . 
RUN npm install
COPY . .
RUN npm run build

# add a static health file
RUN echo "ok" > /react-quiz/build/healthz.html

# Step 2: Serve the React application with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /react-quiz/build .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
