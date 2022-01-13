(function($){
        console.log("Loading quotes");

        function loadQuotes() {
                $.getJSON( "/api/quotes/chucknorris/", function (quotes) {
                        console.log(quotes.text);
                        var message = String(quotes.text);
                        $("#cn quote").text(message);
                });
				
				$.getJSON( "/api/quotes/dad/", function (quotes) {
                        console.log(quotes.text);
                        var message = String(quotes.text);
                        $("#dad quote").text(message);
                });
        };
        loadQuotes();
        setInterval (loadQuotes, 5000);
})(jQuery);