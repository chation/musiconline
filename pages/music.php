<?php
$username='root';
$userpass='root';
$host='127.0.0.1';
$database='music';
$conn=new mysqli($host,$username,$userpass,$database);
if(!$conn){
	echo '-1';
	exit;
}

$name = trim($_GET['name']);

$sql="SELECT * FROM `music` WHERE `address` LIKE '".'%'.$name.'%'."' ";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
        echo "<tr><td></td><td>".$row['name']."</td><td>".$row['autor']."</td><td><a href='#' onclick='downloadMusicByList(this)' target='_blank'><span class='icon-cloud-download'>下载</span></a></td><td><a href='#' onclick='addBySearch(this)' target='_blank'><span class='icon-cloud'></span> 添加</a></td></tr>";
    }
} else {
    echo "0";
}
$conn->close();
?>