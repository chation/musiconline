/* 通过insertBefore函数编写insertAfter函数 */
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
/* 删除指定id的元素 */
function removeElem(elemId) {
    if (document.getElementById(elemId)) {
        var elem = document.getElementById(elemId);
        elem.parentNode.removeChild(elem);
    }
}
/* 创建指定歌名的播放器 */
function play_music() {
    var music_name = document.getElementById("music_name").value;
    if (music_name == "") {
        alert("请输入歌名!");
        return false;
    } else {
        removeElem("music_playbox");
        var name_address = "music.php?name=" + music_name;
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", name_address);
        iframe.setAttribute("width", "620px");
        iframe.setAttribute("height", "155px");
        iframe.setAttribute("id", "music_playbox");
        iframe.setAttribute("frameborder", "no");
        iframe.setAttribute("marginwidth", "0");
        var form = document.getElementById("from1");
        insertAfter(iframe, form);
    }
}

function enterPress(e) { //使用enter实现同样的功能
    var e = e || window.event;
    if (e.keyCode == 13) {
        play_music();
    }
}

function prepare() {
    var button = document.getElementById("start");
    button.onclick = function () {
        play_music();
    };
}

window.onload = prepare;

var uploadLink = document.getElementById("upload_link");
uploadLink.onclick = function () {
    removeElem("music_playbox");
    var name_address = "upload_music.html";
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", name_address);
    iframe.setAttribute("width", "300px");
    iframe.setAttribute("height", "240px");
    iframe.setAttribute("id", "music_playbox");
    var form = document.getElementById("from1");
    insertAfter(iframe, form);
    return false;
}