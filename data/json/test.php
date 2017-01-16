<?php 
    $filename = "chation99.json";
    $json_string = file_get_contents($filename);
    $data = json_decode($json_string, true);
    
    // 显示出来看看
    var_dump($data);
    echo '<br><br>';
    print_r($data);
    echo '<br><br>';

    $index = sizeof($data);
    $data[$index]['mp3'] = "music/五月天-好好.mp3";
    $data[$index]['oga'] = "";
    $data[$index]['title'] = "好好";
    $data[$index]['artist'] = "五月天";
    $data[$index]['rating'] = "3";
    $data[$index]['buy'] = "#";
    $data[$index]['price'] = "";
    $data[$index]['duration'] = "03:19";
    $data[$index]['cover'] = "pic/userHead/bq2.jpg";
    var_dump($data);

    $json_string = json_encode($data);
    file_put_contents('chation99.json', $json_string);
?>