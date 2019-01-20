<?php

$botToken = '709640004:AAFGHsOpg2yPvDnAE7E6aEKXWScIcnjfOSY';
$chatId = '-396860479';
$message = urldecode($_GET['message']);

$message = urlencode(str_replace("<br>", "\n", $message));


$xml = file_get_contents(
    "https://api.telegram.org/bot$botToken/sendMessage?chat_id=$chatId&parse_mode=html&text=$message"
);
$xml = file_get_contents(
    "https://api.telegram.org/bot$botToken/sendMessage?chat_id=254410503&parse_mode=html&text=$message"
);

echo $xml;