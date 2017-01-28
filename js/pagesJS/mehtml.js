/**
 * Created by Chation on 2017/1/24.
 */
/* 构建window.onLoad能运行多个函数的函数 */
function addLoadEvent(func) {
    var oldOnLoad = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            oldOnLoad();
            func();
        }
    }
}

/* 修改input样式 */
function loginStyle(idInput, passInput, loginBtn) {
    var classes = "", oldClasses = "";
    var userId = document.getElementById(idInput);
    var userPass = document.getElementById(passInput);
    var login = document.getElementById(loginBtn);
    login.addEventListener("click", function (event) {
        if (userId.value != "" && userPass.value != "") {
            oldClasses = this.getAttribute("class");
            classes = oldClasses + " disabled";
            this.setAttribute("class", classes);
            this.innerHTML = "<i class='icon-refresh icon-spin'></i> 正在登陆...";

            var idU = userId.value;
            var passU = userPass.value;

            event.preventDefault();
            ajaxLogin(idU, passU, oldClasses);

        } else {
            if (userId.value == "") {
                classes = userId.parentNode.getAttribute("class");
                userId.parentNode.setAttribute("class", classes + " has-error");
            }
            if (userPass.value == "") {
                classes = userPass.parentNode.getAttribute("class");
                userPass.parentNode.setAttribute("class", classes + " has-error");
            }
        }
    }, false);
    var focus = function () {
        this.parentNode.setAttribute("class", "input-group");
    };
    userId.addEventListener("focus", focus, false);
    userPass.addEventListener("focus", focus, false);
}

/* Ajax登录 */
function ajaxLogin(id, pass, classes) {
    var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "pages/loginByNav.php?user_id=" + id + "&user_pass=" + pass, false);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText != 0) {
                var textArray = xmlhttp.responseText.split("|");
                document.getElementById("inputBox").innerHTML = "<h3>欢迎回来，" + textArray[1] + "</h3><img class='img-responsive img-circle' src='" + textArray[3] + "'>";
                document.getElementById("user_name_nav").innerHTML = " " + textArray[1] + "，欢迎你！";
                document.getElementById("user_img_nav").setAttribute("src", textArray[3]);
                document.getElementById("user_info_nav").style.visibility = "";
                document.getElementById("loginAndReg").style.visibility = "hidden";
                document.getElementById("loginAndReg1").style.visibility = "hidden";

                var exp = new Date();
                var passHash = hex_md5(pass);
                exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24);
                document.cookie = "music_identify=" + id + ";expires=" + exp.toGMTString();
                document.cookie = "music_key_code=" + passHash + ";expires=" + exp.toGMTString();

                removeElem("warningTip");
                printfMusic(textArray[0]);

            } else {
                var login = document.getElementById("login_to");
                login.setAttribute("class", classes);
                login.innerHTML = "<i class='glyphicon glyphicon-log-in'></i> 登 录";
                removeElem("warningTip");
                var tips = "账号或密码错误！";
                var form = document.getElementById("form1");
                form.insertBefore(alertBox(tips, "warning"), form.childNodes[0]);
            }
        }
    };
    xmlhttp.send();
}

/* 新建提示框innerHTML */
function alertBox(tip, color) {
    var box = document.createElement("div");
    box.setAttribute("id", "warningTip");
    box.setAttribute("class", "alert alert-" + color + " alert-dismissible");
    box.setAttribute("role", "alert");
    box.innerHTML = "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + tip;
    return box;
}

/* 下拉框偏移量 */
function dropdownPosition() {
    var windowWidth = document.body.clientWidth;
    var divMainWidth = document.getElementById("divMain").clientWidth;
    var navWidth = Math.ceil((windowWidth - divMainWidth) / 2 + 50) + "px";
    var dropDown = document.getElementById("user_info_dropdown");
    dropDown.style.right = navWidth;
}

/* 删除指定id的元素 */
function removeElem(elemId) {
    if (document.getElementById(elemId)) {
        var elem = document.getElementById(elemId);
        elem.parentNode.removeChild(elem);
    }
}

/* 获取指定cookie */
function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name)
            return arr[1];
    }
    return "";
}

/* 读取cookie识别登录状态 */
function checkLogin() {
    if (getCookie("music_identify") != "" && getCookie("music_key_code") != "") {
        var id = getCookie("music_identify"),
            pass = getCookie("music_key_code"),
            xmlhttp;

        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", "pages/loginByCookie.php?user_id=" + id + "&user_pass=" + pass, false);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (xmlhttp.responseText != 0) {
                    var textArray = xmlhttp.responseText.split("|");
                    document.getElementById("user_name_nav").innerHTML = " " + textArray[1] + "，欢迎你！";
                    document.getElementById("user_img_nav").setAttribute("src", textArray[3]);
                    document.getElementById("user_info_nav").style.visibility = "";
                    document.getElementById("loginAndReg").style.visibility = "hidden";
                    document.getElementById("loginAndReg1").style.visibility = "hidden";

                    printfMusic(textArray[0]);

                } else {
                    //wait
                }
            }
        };
        xmlhttp.send();
    }
}

/* Ajax删除歌曲 */
function delMusic(name,art,user){
    var xmlhttp,
        url = "data/userlist/delmusic.php?name=" + name + "&art=" + art + "&user=" + user,
        flag = -1;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", url, false);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if(xmlhttp.responseText == "1"){
                flag = 1;
            }else{
                flag = 0;
            }
        }
    };
    xmlhttp.send();
    return flag;
}

/* 退出登录刷新页面,删除cookie状态 */
function exitLogin() {
    document.cookie = "music_identify=";
    document.cookie = "music_key_code=";
    window.location.reload(true);
}

/* 删除歌单 */
function delByList(e, event) {
    event.preventDefault();
    var tr = e.parentNode.parentNode,
        name = tr.childNodes[1].innerHTML,
        art = tr.childNodes[2].innerHTML;
    var user = getCookie("music_identify");
    if (confirm("确定从你的歌单移除 " + name + " - " + art + " ?")) {
        if(delMusic(name,art,user)==1){
            printfMusic(user);
        }
    }
}

/* 从userlist下载歌曲 */
function downloadMusicByList(e) {
    var tr = e.parentNode.parentNode,
        name = tr.childNodes[1].innerHTML,
        art = tr.childNodes[2].innerHTML;
    var url = "download.php?name=" + name + "&art=" + art;
    e.setAttribute("href", url);
}

/* 打印默认歌单表格 */
function printfMusic(username) {
    var date = new Date(),
        table = document.getElementById("musicTable");
    table.innerHTML = "<tr><th>预览</th><th>歌曲</th><th>歌手</th><th>下载</th><th>删除</th></tr>";
    $.getJSON("data/json/" + username + ".json", {Time: date.toDateString(), Math: Math.random()}, function (data) {
        for (var i = 0; i < data.length; i++) {
            var newTr = table.insertRow();
            newTr.innerHTML = "<td><img class='small_cover' src='" + data[i].cover + "'></td><td>" + data[i].title + "</td><td>" + data[i].artist + "</td><td><a href='#' onclick='downloadMusicByList(this)' target='_blank'><span class='icon-cloud-download'></span></a></td><td><a href='#' onclick='delByList(this,event)' target='_blank'> <span class='icon-remove'></span></a></td>"
        }
    });
}

/* 导航栏搜索歌曲 */
function searchMusic(){
    var name = document.getElementById("top-nav-search"),
        value = name.value.trim(),
        table = document.getElementById("search_list");
    if(value != ""){
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", "pages/music.php?name="+value, false);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (xmlhttp.responseText != 0 && xmlhttp.responseText != -1) {
                    table.innerHTML = xmlhttp.responseText;
                } else {
                    table.innerHTML = "您搜索的歌曲在曲库里没有找到,您可以选择<a href='upload.html'>上传</a>";
                }
            }
        };
        xmlhttp.send();
    }else{
        table.innerHTML = "请输入歌曲名...";
    }
}


/**
 *  main()
 */
//设置下拉框位置,绑定到窗口resize
dropdownPosition();
window.addEventListener("resize", dropdownPosition, false);
//给登录框绑定样式事件
loginStyle("user_id", "user_pass", "login_to");
//识别登录状态
window.addLoadEvent(checkLogin);
//绑定退出登录按钮事件
document.getElementById("exitUser").addEventListener("click", exitLogin, false);
//判断是否登陆
if (getCookie("music_identify") == "") {
    var tips = "只有登录后才能创建自己的歌单哦 ! ",
        form = document.getElementById("left_window"),
        btn = document.getElementById("music_btn");
    form.insertBefore(alertBox(tips, "warning"), form.childNodes[0]);
}
//add search music
document.getElementById("search_btn").addEventListener("click",searchMusic,false);