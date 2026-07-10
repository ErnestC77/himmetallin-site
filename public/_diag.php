<?php
header('Content-Type: text/plain; charset=utf-8');
foreach ($_SERVER as $k => $v) {
    if (preg_match('/^(HTTP_X_|HTTPS$|SERVER_PORT$|REQUEST_SCHEME$|HTTP_HOST$)/', $k)) {
        echo "$k = $v\n";
    }
}
