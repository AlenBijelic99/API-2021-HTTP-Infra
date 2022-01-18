FROM nginx

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]

COPY ./content/ /usr/share/nginx/html

#FROM nginx
#COPY nginx.conf /etc/nginx/nginx.conf