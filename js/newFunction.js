/**
 * Created by Chation on 2017/1/2.
 */

/**
 * 序列化表单数据用于AJAX
 * 或者使用XHR2级 new FormData(form)
 */
function seriaLize(form) {
    var parts = [],
        field = null,
        i,
        len,
        j,
        optLen,
        option,
        optValue;

    for (i = 0, len = form.elements.length; i < len; i++) {
        field = form.elements[i];

        switch (field.type) {
            case "select-one":
            case "select-multiple":
                if (field.name.length) {
                    for (j = 0, optLen = field.options.length; j < optLen; j++) {
                        option = field.options[j];
                        if (option.selected) {
                            optValue = "";
                            if (option.hasAttribute) {
                                optValue = (option.hasAttribute("value") ? option.value : option.text);
                            } else {
                                optValue = (option.attributes["value"].specified ? option.value : option.text);
                            }
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                        }
                    }
                }
                break;
            case undefined:     //fieldset
            case "file":        //file input
            case "submit":      //submit button
            case "reset":       //reset button
            case "button":      //custom button
                break;

            case "radio":       //radio button
            case "checkbox":    //checkbox
                if (!field.checked) {
                    break;
                }
            /* falls through */

            default:
                //don't include form fields without names
                if (field.name.length) {
                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
        }
    }
    return parts.join("&");
}

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
    var classes = "",oldClasses = "";
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
            ajaxLogin(idU,passU,oldClasses);

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
function ajaxLogin(id,pass,classes){
    var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", "pages/loginByNav.php?user_id=" + id + "&user_pass=" + pass, false);

    xmlhttp.onreadystatechange = function xx() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText != 0) {
                var textArray = xmlhttp.responseText.split("|");
                document.getElementById("inputBox").innerHTML = "<h3>欢迎回来，" + textArray[1] + "</h3><img class='img-responsive img-circle' src='" + textArray[2] + "'>";
                document.getElementById("user_name_nav").innerHTML = " " + textArray[1] + "，欢迎你！";
                document.getElementById("user_img_nav").setAttribute("src", textArray[2]);
                document.getElementById("user_info_nav").style.visibility = "";
                document.getElementById("loginAndReg").style.visibility = "hidden";
                document.getElementById("loginAndReg1").style.visibility = "hidden";
            }else{
                var login = document.getElementById("login_to");
                login.setAttribute("class",classes);
                login.innerHTML = "<i class='glyphicon glyphicon-log-in'></i> 登 录";
                var tips = "账号或密码错误！";
                var form = document.getElementById("form1");
                form.insertBefore(alertBox(tips,"warning"),form.childNodes[0]);
            }
        }
    };
    xmlhttp.send();
}

/* 新建提示框innerHTML */
function alertBox (tip,color){
    var box = document.createElement("div");
    box.setAttribute("class","alert alert-"+color+" alert-dismissible");
    box.setAttribute("role","alert");
    box.innerHTML = "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><spanaria-hidden='true'>&times;</span></button>"+tip;
    return box;
}

/* 下拉框偏移量 */
function dropdownPosition(){
    var windowWidth = document.body.clientWidth;
    var divMainWidth = document.getElementById("divMain").clientWidth;
    var navWidth = Math.ceil((windowWidth - divMainWidth) / 2 + 50 ) + "px";
    var dropDown = document.getElementById("user_info_dropdown");
    dropDown.style.right = navWidth;
}
dropdownPosition();
window.addEventListener("resize", dropdownPosition, false);
loginStyle("user_id", "user_pass", "login_to");
