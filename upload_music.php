<?php
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
?>

<html>
<head>
	<title>Upload - Clude music</title>
</head>
<body>
<?php

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
$autor = trim($_POST['autor']);
$fileurl = $_FILES['userfile']['tmp_name'];//上传后的临时文件地址
$filename = $_FILES['userfile']['name'];//用户文件名
$filesize = formatBytes($_FILES['userfile']['size']);//调用单位转换函数,将B转换为MB

/* 使用mime_content_type()函数进行文件MIME类型的判断
  比单纯的$_FILES['userfile']['type'];判断更加精确
  以防止文件过滤误伤 */
if(mime_content_type($fileurl) != "audio/mpeg") {
    echo "<p style='color:red;'>您上传的文件貌似不是mp3格式的文件呢~</p>";
    echo "您上传的文件类型为: ".mime_content_type($fileurl)."<p>请上传正确的MP3格式的文件~!</p>";
    exit;
}

$newname = $autor.'-'.$name.'.mp3';//创建新的文件名
$swichtype = "music/".iconv('utf-8','gbk',$newname);//将UTF-8编码转化为windows系统的GBK编码进行命名
move_uploaded_file($fileurl,$swichtype);//移动文件到置顶目录

echo "您正在上传 : ".$filename."<p> 大小 : ".$filesize."</p>".$newname."</p> ";

$address = "music/".$autor.'-'.$name.'.mp3';//创建以导入数据库的文件路径
$sql = "INSERT INTO `music` (`name`, `autor`, `address`) VALUES ('".$name."', '".$autor."', '".$address."');";

$result = $conn -> query($sql);
    if($result) {
        echo "<p style='color:green;'>恭喜,歌曲已经成功上传到云端~</p>";
    }else {
        echo "<p style='color:red;'>抱歉,您上传的歌曲在云端已经有了呢~,您可以尝试重新搜索~</p>";
    }
$conn -> close();
?>
</body>
</html>