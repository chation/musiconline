/**
 * Created by Chation on 2017/1/5.
 */

/* change btn style */
function loginStyle(nameInput, idInput, passInput, passAgain, loginBtn) {
    var classes = "",oldClasses = "";
    var userName = document.getElementById(nameInput);
    var userId = document.getElementById(idInput);
    var userPass = document.getElementById(passInput);
    var userAgain = document.getElementById(passAgain);
    var login = document.getElementById(loginBtn);
    login.addEventListener("click", function (event) {
        if (userId.value != "" && userPass.value != "" && userName.value != "" && userAgain.value != "" && userPass.value==userAgain.value) {
            oldClasses = this.getAttribute("class");
            classes = oldClasses + " disabled";
            this.setAttribute("class", classes);
            this.innerHTML = "<i class='icon-refresh icon-spin'></i> 正在注册...";

            var nameU = userName.value;
            var idU = userId.value;
            var passU = userPass.value;

            event.preventDefault();
            ajaxLogin(nameU,idU,passU,oldClasses);

        } else {
            if (userId.value == "") {
                classes = userId.parentNode.getAttribute("class");
                userId.parentNode.setAttribute("class", classes + " has-error");
            }
            if (userPass.value == "") {
                classes = userPass.parentNode.getAttribute("class");
                userPass.parentNode.setAttribute("class", classes + " has-error");
            }
            if (userAgain.value == "") {
                classes = userAgain.parentNode.getAttribute("class");
                userAgain.parentNode.setAttribute("class", classes + " has-error");
            }
            if (userName.value == "") {
                classes = userName.parentNode.getAttribute("class");
                userName.parentNode.setAttribute("class", classes + " has-error");
            }
        }
    }, false);
    var focus = function () {
        this.parentNode.setAttribute("class", "input-group");
    };
    userName.addEventListener("focus", focus, false);
    userId.addEventListener("focus", focus, false);
    userPass.addEventListener("focus", focus, false);
    userAgain.addEventListener("focus", focus, false);

}

/* Ajax登录 */
function ajaxLogin(name,id,pass,classes){
    var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "regAcc.php?user_name=" + name + "&email_address=" + id + "&password=" + pass, false);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText == "1") {
                removeElem("form1");
                document.getElementById("form-reg").innerHTML = "<h3>欢迎你，" + name + "</h3><img class='img-responsive img-circle' src='../pic/default.jpg'><div id='backTo'><a href='../index.html'>去登录!</a></div>";
            }else{
                var login = document.getElementById("login_to");
                login.setAttribute("class",classes);
                login.innerHTML = "<i class='glyphicon glyphicon-log-in'></i> 注 册";
                removeElem("warningTip");
                var tips = "发生错误,注册失败！";
                var form = document.getElementById("form-reg");
                form.insertBefore(alertBox(tips,"warning"),form.childNodes[0]);
            }
        }
    };
    xmlhttp.send();
}

/* Ajax验证用户名是否存在 */
function hasUserName(){
    var xmlhttp;
    var tips = document.getElementById("sameUsername");
    var name = document.getElementById("email_address").value;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "hasUserName.php?name="+name, false);

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText == "1") {
                tips.style.visibility = "";
                tips.style.color = "green";
                tips.innerHTML = "* 恭喜你,帐号可以使用!";
            }else {
                tips.style.visibility = "";
                tips.style.color = "red";
                tips.innerHTML = "* 账号已被占用!"
            }
        }
    };
    xmlhttp.send();
}

/* 删除指定id的元素 */
function removeElem(elemId) {
    if (document.getElementById(elemId)) {
        var elem = document.getElementById(elemId);
        elem.parentNode.removeChild(elem);
    }
}
/* 新建提示框innerHTML */
function alertBox (tip,color){
    var box = document.createElement("div");
    box.setAttribute("id","warningTip");
    box.setAttribute("class","alert alert-"+color+" alert-dismissible");
    box.setAttribute("role","alert");
    box.innerHTML = "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><spanaria-hidden='true'>&times;</span></button>"+tip;
    return box;
}


loginStyle("user_name","email_address","password","password-again","login_to");
var user_id = document.getElementById("email_address");
user_id.addEventListener("blur",hasUserName,false);