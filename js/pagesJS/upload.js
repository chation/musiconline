/**
 * Created by Chation on 2017/1/22.
 */
/* 修改input样式 */
function formStyle(idInput, passInput, aluInput, loginBtn) {
    var classes = "", oldClasses = "";
    var userId = document.getElementById(idInput);
    var userPass = document.getElementById(passInput);
    var alu = document.getElementById(aluInput);
    var login = document.getElementById(loginBtn),
        file = document.getElementById("music_file");
    login.addEventListener("click", function (event) {
        if (userId.value != "" && userPass.value != "" && alu.value != "" && file.value != "") {
            event.preventDefault();
            if (getCookie("music_identify") == "") {
                alert("请先登录!且不要对文档进行修改,谢谢配合!");
            } else {
                oldClasses = this.getAttribute("class");
                classes = oldClasses + " disabled";
                this.setAttribute("class", classes);
                this.innerHTML = "<i class='icon-refresh icon-spin'></i> 上传中";

                //ajax upload
                var form = document.getElementById("form_upload");
                var progress1 = document.getElementById("prog1");
                var value = document.getElementById("show_pro");
                var formData = new FormData(form);

                var xmlhttp;
                if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                } else {// code for IE6, IE5
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }

                var upload = xmlhttp.upload;
                upload.onprogress = function (e) {
                    var sum = Math.round((e.loaded / e.total) * 100);
                    value.innerHTML = sum + "%";
                    progress1.style.width = sum + "%";
                };

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        document.getElementById("result").innerHTML = xmlhttp.responseText;
                        document.getElementById("music_btn").setAttribute("class", "btn btn-primary btn-lg pull-right");
                        document.getElementById("music_btn").innerHTML = "上传音乐";
                    }
                };
                xmlhttp.open("POST", form.action, true);
                xmlhttp.send(formData);
            }
        } else {
            if (userId.value == "") {
                classes = userId.parentNode.getAttribute("class");
                userId.parentNode.setAttribute("class", classes + " has-error");
            }
            if (userPass.value == "") {
                classes = userPass.parentNode.getAttribute("class");
                userPass.parentNode.setAttribute("class", classes + " has-error");
            }
            if (alu.value == "") {
                classes = alu.parentNode.getAttribute("class");
                alu.parentNode.setAttribute("class", classes + " has-error");
            }
        }
    }, false);
    var focus = function () {
        this.parentNode.setAttribute("class", "input-group input-group-lg");
    };
    userId.addEventListener("focus", focus, false);
    userPass.addEventListener("focus", focus, false);
    alu.addEventListener("focus", focus, false);
}
/**
 * main()
 */
//上传框style
formStyle("music_name", "music_art", "music_alu", "music_btn");
//判断是否登陆
if (getCookie("music_identify") == "") {
    var tips = "只有登录后才可以上传音乐哦 ! ",
        form = document.getElementById("left_window"),
        btn = document.getElementById("music_btn");
    form.insertBefore(alertBox(tips, "warning"), form.childNodes[0]);
    btn.setAttribute("disabled", "disabled")
}

