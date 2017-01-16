<?php
$filename = "../data/json/user_default_list.json";
$json_string = file_get_contents($filename);
$data = json_decode($json_string, true);

$json_string = json_encode($data);
file_put_contents('../data/json/xxxx.json', $json_string);
?>