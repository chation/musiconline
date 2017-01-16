/**
 * Created by Chation on 2017/1/2.
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

                player(textArray[0]);

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

                    player(textArray[0]);

                } else {
                    //wait
                }
            }
        };
        xmlhttp.send();
    }
}

/* 退出登录刷新页面,删除cookie状态 */
function exitLogin() {
    document.cookie = "music_identify=";
    document.cookie = "music_key_code=";
    window.location.reload(true);
}

/* 初始化播放器 */
function player(username) {
    removeElem("infoMat");
    //var myPlaylist = eval("[" + list + "]");
    $.getJSON("data/json/"+username+".json",function(data){
        $('#musicplayer').ttwMusicPlayer(data,
            {
                currencySymbol: "<span class='icon-cog'></span>",
                buyText: " 删除",
                tracksToShow: 10,
                autoPlay: false,
                ratingCallback: function (index, playlistItem, rating) {
                },
                jPlayer: {}
            }
        );
    })
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