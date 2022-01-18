# Labo HTTP Infra

Alen BIJELIC & Stefano Pontarolo


## Step 1: Static HTTP server with nginx

For this step, unlike in videos, we decided to use nginx to try it out.

As it is a basic website using a template, the main objective here is to copy files from our PC to the container. For it we use the COPY command in the Dockerfile.

The template that we use is free to use and was found [here](https://bootstrapmade.com/knight-free-bootstrap-theme/)

We also want to read and edit file from SSH connection so we need to install vim.

In the nginx-js-image directory, you will find the scripts to build the image, run the container and connect to the container.

## Step 2: Dynamic HTTP server with express.js

For the express app, we had to create a REST API giving some information. We decided to use [give-me-a-joke](https://www.npmjs.com/package/give-me-a-joke) package to generate different kinds off jokes.

Our API has 5 different endpoints:
* / : Is the index page and explains how our API works
* /dad: returns a dad joke
* /chucknorris: returns a chucknorris joke
* /custom: returns a custom joke. The user needs to add his firstname and lastname in the request
* /category/:category : returns a categorised joke. Categories available are explained in index page


## Step 3: Reverse proxy with apache (static configuration)

*To build a simple reverse proxy we need to configure the Dockerfile in the following way
FROM php:5.6-apache

COPY conf/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*

*Then we need to configure the file 000-default.conf

<VirtualHost *:80>
</VirtualHost>

*And the file 001-reverse-proxy.conf to use the reverse proxy

<VirtualHost *:80>
	ServerName demo.api.ch
	
	ProxyPass "/api/quotes/" "http://172.17.0.3:3000/"
	ProxyPassReverse "/api/quotes/" "http://172.17.0.3:3000/"
	
	ProxyPass "/" "http://172.17.0.2:80/"
	ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>

###Build the docker image from each root

Docker build -t api/nginx_static .
Docker build -t api/express_dynamic .
Docker build -t api/apache_rp .

###Run the container
*Since in this step we hard-coded the IP adress for the reverse proxy, for our configuration to work and to get the ip addresses that correspond to the right containers, 
*the containers must be launched in the following order

Docker run -d --name nginx_static api/nginx_static
Docker run -d --name express_dynamic api/express_dynamic
Docker run -d -p 8080:80 --name apache_rp api/apache_rp

*to access our site, go to the following page demo.api.ch:8080

*Configuring the reverse proxy in this way is very dangerous as it would be enough that a container is already running on docker and our entire configuration would fail.



## Step 4: AJAX requests with JQuery

*In this step we want to send a request from the static server to the dynamic server and affect the data that we get from the dynamic server to the HTML page on the static server.
*In a nginx server the directory to find the index.html and js are the following:
usr/share/nginx/html
usr/share/nginx/html/assets/js
*We changed the index.html to add some id to our place where we want to change the text with quotes.
<h3 id="quote" data-aos="fade-up">Quotes</h2>
*To send a AJAX request we need a JavaScript to do the request, so in the directory /js we created quotes.js
(function($){
        console.log("Loading quotes");

        function loadQuotes() {
                $.getJSON( "/api/quotes/chucknorris/", function (quotes) {
                        console.log(quotes.text);
                        var message = String(quotes.text);
                        $("#cn quote").text(message);
                });
        };
        loadQuotes();
        setInterval (loadQuotes, 5000);
})(jQuery);

*This function takes Chuck Norris quotes and it replace every 5 seconds in our HTML page the tags whose id is #quote

###Build the docker image from each root

Docker build -t api/nginx_static .
Docker build -t api/express_dynamic .
Docker build -t api/apache_rp .

###Run the container
*Since in this step we still have hard-coded the IP adress for the reverse proxy, for our configuration to work and to get the ip addresses that correspond to the right containers, 
*the containers must be launched in the following order

Docker run -d --name nginx_static api/nginx_static
Docker run -d --name express_dynamic api/express_dynamic
Docker run -d -p 8080:80 --name apache_rp api/apache_rp

*to access our site, go to the following page demo.api.ch:8080

## Step 5: Dynamic reverse proxy configuration

Now we modify our Dockerfile to enable the copy of our PHP script which will automatically update VirtualHost addresses.

We also introduce a new file: apache2-foreground which will contain our IP addresses, that will be fullify by the PHP script when running the container.
The IP addresses are stored in these variables: STATIC_APP and DYNAMIC_APP.

The website will always work as before except if we change one of our container IP address, these changes will automatically be applied when running the container and specifying the new IP addresses.
