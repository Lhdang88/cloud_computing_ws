# Base OS from Dockerhub
FROM ubuntu:latest
# update software repository and install nodejs
RUN apt-get update &&  apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
# copy local data into image
ADD . /myApp/
# install packages
RUN cd /myApp && npm install
# set working directory
WORKDIR /myApp
# start command
CMD node index.js
