FROM node:16.13.1

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]

COPY src /opt/app



CMD [ "node", "/opt/app/index.js" ]