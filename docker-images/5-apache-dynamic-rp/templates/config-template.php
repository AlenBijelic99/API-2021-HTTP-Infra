<?php 

    $ip_address_static = getenv("STATIC_APP");
    $ip_address_dynamic = getenv("DYNAMIC_APP");
?>

<VirtualHost *:80>
	ServerName demo.api.ch
	
	ProxyPass "/api/quotes/" "http://<?php print $ip_address_dynamic ?>/"
	ProxyPassReverse "/api/quotes/" "http://<?php print $ip_address_dynamic ?>/"
	
	ProxyPass "/" "http://<?php print $ip_address_static ?>/"
	ProxyPassReverse "/" "http://<?php print $ip_address_static ?>/"
</VirtualHost>