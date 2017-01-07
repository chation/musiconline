<?php
$username='root';
$userpass='q12we3';
$host='127.0.0.1';
$database='music';
$conn=new mysqli($host,$username,$userpass,$database);
if(!$conn){
	echo '-1';
	exit;
}

$user_name = trim($_GET['user_name']);
$user_id = trim($_GET['email_address']);
$user_pass = md5($_GET['password']);

$sql = "INSERT INTO `user` (`user_id`, `user_name`, `user_pass`, `user_icon`, `music_list`) VALUES ('$user_id', '$user_name', '$user_pass', 'pic/default.jpg', '0')";

if ($conn->query($sql) === TRUE) {
    echo "1";
} else {
    echo "0";
}

$conn->close();

?>