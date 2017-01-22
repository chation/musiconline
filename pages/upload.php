<?php
error_reporting(0);

header("Content-Type:text/html;charset=utf-8");
$username='root';//数据库链接过程
$userpass='q12we3';
$host='127.0.0.1';
$database='music';
$conn=new mysqli($host,$username,$userpass,$database);
if(!$conn){
	echo 'Could not connect to database.';
	exit;
}
function formatBytes($size) {//存储数据单位转换
    $units = array(' B', ' KB', ' MB', ' GB', ' TB');
    for ($i = 0; $size >= 1024 && $i < 4; $i++)
    $size /= 1024;
    return round($size, 2).$units[$i];
}

if($_FILES['userfile']['error'] > 0) {//判断传入文件错误类型
    echo '上传失败 : ';
    switch ($_FILES['userfile']['error']) {
        case '1': echo '<p>抱歉,您上传的文件过大</p>';  
            break;
        case '2': echo '<p>抱歉,您上传的文件过大</p>';  
            break;
        case '3': echo '<p>抱歉,网络原因文件上传错误,请后退重新上传</p>';  
            break;
        case '4': echo '<p>抱歉,请正确选择文件</p>';  
            break;
        case '6': echo '<p>抱歉,系统错误,请联系管理员</p>';  
            break;
        case '7': echo '<p>抱歉,系统错误,请联系管理员</p>';  
            break;
    }
    exit;
}

$name = trim($_POST['name']);//html表单post到的信息
$autor = trim($_POST['art']);
$fileurl = $_FILES['userfile']['tmp_name'];//上传后的临时文件地址
$filename = $_FILES['userfile']['name'];//用户文件名
$filesize = formatBytes($_FILES['userfile']['size']);//调用单位转换函数,将B转换为MB

/* 使用mime_content_type()函数进行文件MIME类型的判断
  比单纯的$_FILES['userfile']['type'];判断更加精确
  以防止文件过滤误伤 */
if(($_FILES['userfile']['type'] != "audio/mpeg") && (mime_content_type($fileurl) != "audio/mpeg")
&&($_FILES['userfile']['type'] != "audio/mp3") && (mime_content_type($fileurl) != "audio/mp3")) {
    echo "<p style='color:red;'>您上传的文件貌似不是mp3格式的文件呢~</p>";
    echo "<p>请上传正确的MP3格式的文件~!</p>";
    exit;
}

$newname = $autor.'-'.$name.'.mp3';//创建新的文件名
$swichtype = "../music/".iconv('utf-8','gbk',$newname);//将UTF-8编码转化为windows系统的GBK编码进行命名
move_uploaded_file($fileurl,$swichtype);//移动文件到置顶目录

echo "您正在上传 : ".$filename."<p> 大小 : ".$filesize."</p>".$newname."</p> ";

$address = "music/".$autor.'-'.$name.'.mp3';//创建以导入数据库的文件路径
$sql = "INSERT INTO `music` (`name`, `autor`, `address`) VALUES ('".$name."', '".$autor."', '".$address."');";

$result = $conn -> query($sql);
    if($result) {
        echo "<p style='color:green;'>恭喜,歌曲已经成功上传到云端~</p>";
    }else {
        echo "<p style='color:red;'>抱歉,您上传的歌曲在云端已经有了呢~,您可以尝试重新搜索~</p>";
        exit;
    }
$conn -> close();

    $filename = "../data/json/all_default_list.json";
    $json_string = file_get_contents($filename);
    $data = json_decode($json_string, true);
    
    $index = sizeof($data);
    $data[$index]['mp3'] = "music/".$autor.'-'.$name.'.mp3';
    $data[$index]['oga'] = "";
    $data[$index]['title'] = $name;
    $data[$index]['artist'] = $autor;
    $data[$index]['rating'] = "5";
    $data[$index]['buy'] = "#";
    $data[$index]['price'] = "";
    $data[$index]['duration'] = "$autor";
    $data[$index]['cover'] = "pic/cover/default.jpg";

    $json_string = json_encode($data);
    file_put_contents('../data/json/all_default_list.json', $json_string);
?>
</body>
</html>