<?php
//删除歌单歌曲
$music_name = $_GET['name'];
$music_art = $_GET['art'];
$user_name = $_GET['user'];

$filename = "../json/".$user_name.".json";
$json_string = file_get_contents($filename);
$data = json_decode($json_string, true);

for($i=0,$len=sizeof($data);$i<$len;$i++){
    if(($data[$i]['title']==$music_name)&&($data[$i]['artist']==$music_art)){
        array_splice($data,$i,1);
        break;
    }
}

$json_string = json_encode($data);
file_put_contents('../json/'.$user_name.'.json', $json_string);
echo '1';
?>