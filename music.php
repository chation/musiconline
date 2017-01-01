<?php
$username='root';
$userpass='q12we3';
$host='127.0.0.1';
$database='music';
$conn=new mysqli($host,$username,$userpass,$database);
if(!$conn){
	echo 'Could not connect to database.';
	exit;
}

$name = trim($_GET['name']);
echo "<p>".$name."</p>";
$sql="SELECT * FROM `music` WHERE `address` LIKE '".'%'.$name.'%'."' ";
$result=$conn -> query($sql);
$row = $result -> fetch_row();
?>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Clude music</title>
</head>
<body>
	<?php 
	if($row[0]==""){
		echo "抱歉,歌曲库里并没有您搜索的歌曲呢..."."</br>"."您可以选择<a href='upload_music.html'>上传</a>...";
	}else{
		$test = $row[1].'-'.$row[0];
		$links = $row[2];
		echo "<p>"."播放 : ".$test."</p>";
		echo "<audio controls><source src='".$links."' type='audio/mp3' /></audio>";
	}
	?>
</body>
</html>