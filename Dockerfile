FROM node:19.8.1-alpine3.17@sha256:a67a33f791d1c86ced985f339fa160f6188f590ebbe963fe11cc00adc971fa41

WORKDIR /app

COPY . .

# Install dependencies and build our assets for production
RUN yarn install && yarn production
