-- phpMyAdmin SQL Dump
-- version 4.5.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2017-04-15 12:31:26
-- 服务器版本： 5.7.11
-- PHP Version: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `music`
--

-- --------------------------------------------------------

--
-- 表的结构 `music`
--

CREATE TABLE `music` (
  `name` varchar(100) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `address` varchar(300) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `music`
--

INSERT INTO `music` (`name`, `autor`, `address`) VALUES
('奇妙能力歌', '陈粒', 'music/陈粒-奇妙能力歌.mp3'),
('兄弟', '五月天', 'music/五月天-兄弟.mp3'),
('顽固', '五月天', 'music/五月天-顽固.mp3'),
('任意门', '五月天', 'music/五月天-任意门.mp3'),
('如果我们不曾相遇', '五月天', 'music/五月天-如果我们不曾相遇.mp3'),
('Peerless', 'Darin', 'music/Darin-Peerless.mp3'),
('Bad', '东方', 'music/东方-Bad.mp3'),
('转眼', '五月天', 'music/五月天-转眼.mp3'),
('人生有限公司', '五月天', 'music/五月天-人生有限公司.mp3'),
('派对动物', '五月天', 'music/五月天-派对动物.mp3'),
('后来的我们', '五月', 'music/五月-后来的我们.mp3');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `user_id` varchar(16) NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `user_pass` varchar(32) NOT NULL,
  `user_icon` varchar(200) NOT NULL,
  `music_list` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_pass`, `user_icon`, `music_list`) VALUES
('chation99', '恰西', '4f420fe3daa13a8e8b05957aad06f281', 'pic/userHead/qx.jpg', '0'),
('admin001', '管理员001', '4f420fe3daa13a8e8b05957aad06f281', 'pic/userHead/bq2.jpg', '0'),
('123456', '123', '202cb962ac59075b964b07152d234b70', 'pic/default.jpg', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `music`
--
ALTER TABLE `music`
  ADD PRIMARY KEY (`address`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
