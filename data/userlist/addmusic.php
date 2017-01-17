<?php
$music_name = $_GET['name'];
$music_art = $_GET['art'];
$music_cover = $_GET['cover'];
$user_name = $_GET['user'];

$filename = "../json/".$user_name.".json";
$json_string = file_get_contents($filename);
$data = json_decode($json_string, true);

    $index = sizeof($data);
    $data[$index]['mp3'] = "music/".$music_art."-".$music_name.".mp3";
    $data[$index]['oga'] = "";
    $data[$index]['title'] = $music_name;
    $data[$index]['artist'] = $music_art;
    $data[$index]['rating'] = "5";
    $data[$index]['buy'] = "#";
    $data[$index]['price'] = "";
    $data[$index]['duration'] = $music_art;
    $data[$index]['cover'] = $music_cover;

$json_string = json_encode($data);
file_put_contents('../json/'.$user_name.'.json', $json_string);
echo '<script>window.close();</script>'; 
?>