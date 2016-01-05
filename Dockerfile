FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
COPY package.json /app/package.json
RUN cd /app; npm install
COPY . /app
EXPOSE 8080
WORKDIR /app
ENV BASE_URL=http://localhost:49160
ENV API_ENDPOINT=http://localhost:5000
CMD ["npm", "run", "serve"]