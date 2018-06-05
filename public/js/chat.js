function add_firstUserMessage(message, time) {
    if (!time) {
        time = getTime();
    }

    $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
    $("#chatWindow").append('<div class="animated bounceInRight" id="userMessageWrapper"><div id="userMessage"><div id="messageText">' + message + '</div><div id="messageTime">' + time + '</div></div><div id="userCorner"></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}

function add_userMessage(message, time) {
    if (!time) {
        time = getTime();
    }

    $("#chatWindow").append('<div class="animated bounceInRight" id="userMessageWrapper"><div id="userMessage"><div id="messageText">' + message + '</div><div id="messageTime">' + time + '</div></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}

function add_firstFriendMessage(message, time) {
    if (!time) {
        time = getTime();
    }

    $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
    $("#chatWindow").append('<div class="animated bounceInLeft" id="friendMessageWrapper"><div id="friendCorner"></div><div id="friendMessage"><div id="messageText">' + message + '</div><div id="messageTime">' + time + '</div></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}

function add_friendMessage(message, time) {
    if (!time) {
        time = getTime();
    }

    $("#chatWindow").append('<div class="animated bounceInLeft" id="friendMessageWrapper"><div id="friendMessage"><div id="messageText">' + message + '</div><div id="messageTime">' + time + '</div></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}


function add_firstFriendPicture(picture, time) {
    if (!time) {
        time = getTime();
    }
    //this code will me slightly modified

    var reader = new FileReader();
    var photo = "";

    reader.addEventListener("load", function () {
        photo = reader.result;

        $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
        $("#chatWindow").append('<div class="animated bounceInleft" id="friendMessageWrapper"><div id="friendPictureCorner"></div><div id="friendPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div></div>');
        $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
    }, false);

    if (picture) {
        reader.readAsDataURL(picture);
    }
}

function add_friendPicture(picture, time) {
    if (!time) {
        time = getTime();
    }
    //this code will me slightly modified

    var reader = new FileReader();
    var photo = "";

    reader.addEventListener("load", function () {
        photo = reader.result;
        $("#chatWindow").append('<div class="animated bounceInleft" id="friendMessageWrapper"><div id="friendPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div></div>');
        $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
    }, false);

    if (picture) {
        reader.readAsDataURL(picture);
    }
}

function add_firstUserPicture(picture, time, clicked) {
    if (!time) {
        time = getTime();
    }

    if (!clicked) {
        clicked = false;
    }

    var target = $('#currentFriendName').text();
    target = target.trim();

    var reader = new FileReader();
    var photo = "";

    reader.addEventListener("load", function () {
        photo = reader.result;

        $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
        $("#chatWindow").append('<div class="animated bounceInRight" id="userMessageWrapper"><div id="userPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div><div id="userPictureCorner"></div></div>');
        $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
        emitMessage(photo, "image", getTime(), target);
        if (clicked == true) {
            add_message(target, {
                encoding: "image",
                text: photo,
                type: "user",
                date: getTime()
            });
        }
    }, false);

    if (picture) {
        reader.readAsDataURL(picture);
    }
}

function add_userPicture(picture, time, clicked) {
    if (!time) {
        time = getTime();
    }
    if (!clicked) {
        clicked = false;
    }

    var target = $('#currentFriendName').text();
    target = target.trim();

    var reader = new FileReader();
    var photo = "";

    reader.addEventListener("load", function () {
        photo = reader.result;
        $("#chatWindow").append('<div class="animated bounceInRight" id="userMessageWrapper"><div id="userPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div></div>');
        $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
        emitMessage(photo, "image", getTime(), target);
        if (clicked == true) {
            add_message(target, {
                encoding: "image",
                text: photo,
                type: "user",
                date: getTime()
            });
        }
    }, false);

    if (picture) {
        reader.readAsDataURL(picture);
    }
}


function add_firstFriendPictureUrl(photo, time) {
    if (!time) {
        time = getTime();
    }
    $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
    $("#chatWindow").append('<div class="animated bounceInLeft" id="friendMessageWrapper"><div id="friendPictureCorner"></div><div id="friendPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}

function add_friendPictureUrl(photo, time) {
    if (!time) {
        time = getTime();
    }
    $("#chatWindow").append('<div class="animated bounceInLeft" id="friendMessageWrapper"><div id="friendPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}

function add_firstUserPictureUrl(photo, time) {
    if (!time) {
        time = getTime();
    }
    $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
    $("#chatWindow").append('<div class="animated bounceInRight" id="userMessageWrapper"><div id="userPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div><div id="userPictureCorner"></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}

function add_userPictureUrl(photo, time) {
    if (!time) {
        time = getTime();
    }

    $("#chatWindow").append('<div class="animated bounceInRight" id="userMessageWrapper"><div id="userPicture"><div id="pictureWrapper"><a data-fancybox="gallery" href="' + photo + '"><img id="messagePicture" src="' + photo + '"></a></div><div id="messageTime">' + time + '</div></div></div>');
    $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
}


function sendImage(image, type) {
    if (image) {
        // $('#sendButton').animateCss('fadeOutRight');
        if (lastMessageType == 1) {
            lastMessageType = 2;
            add_userPicture(image, getTime(), true);
        } else if (lastMessageType == 2) {
            add_userPicture(image, getTime(), true);
        } else if (lastMessageType == 3 || lastMessageType == 4 || lastMessageType == 0) {
            lastMessageType = 1;
            add_firstUserPicture(image, getTime(), true);
        }
    }
}

function clearChatWindow() {
    $('#chatWindow').empty();
}

function add_emptyLineMessage() {
    $("#chatWindow").append('<div id="messageSpace" class="space"></div>');
}

$('#addUserPic').dblclick(function (e) {
    e.preventDefault();
});
$('#addUserPic').on('click', add_friendUser);

function add_friendUser() {
    var userName = $('#searchText').val();
    if (userName) {
        if (userName != yourUserName) {
            var exist = false;
            socket.emit('userExist', userName, function (data) {
                exist = data;
                if (exist) {
                    addUserTab(userName);
                    $('#searchText').val('');

                    add_user(userName);
                } else {
                    addFriendError("user doesn't exist or isn't online");
                }
            });
        } else addFriendError("you cannot add yourself");
    } else {
        addFriendError("empty search text");
    }
}

$('#searchText').on('click', function () {
    addFriendError("username or email");
});


$('#sendButton').one('click', function () {
    $(this).removeClass("animated fadeInRight");
});

function addFriendError(error) {
    var placeholder = $('#searchText').attr('placeholder', error);
}

//the id will either be global, or it will be local, the server managing the the different codes

function addUserTab(username, lastText, lastDate, photo) {
    if (!photo) {
        photo = "../static/images/ic_person_outline_black_48px.svg";
    }
    if (!lastText) {
        lastText = find_lastMessage(username);
        if (!lastText) {
            lastText = "";
        }
    }
    if (!lastDate) {
        change_lastDate(username);
        lastDate = find_lastDate(username);
        if (!lastDate) {
            lastDate = "";
        }
    }

    if (lastText.length > 25) {
        lastText = lastText.substring(0, 25);
        lastText += "...";
    }

    $('<div class="animated zoomInDown ' + username + '" id="userTab"><img id="userPic" src="' + photo + '" width="64px" height="64px"><div id="userInfo"><div id="topUserInfo"><h1 id="userName" class="display-5">' + username + '</h1><div id="userLastDate"><div id="uLastDate">' + lastDate + '</div></div></div><div id="userLastText">' + lastText + '</div></div></div>').insertAfter("#addUserTab");
    $('#userPic').focus();
    //get the status from the server
    $('#userTab').on('click', function () {
        var username = $(this).find("#userName").text();
        var picture = $(this).find("#userPic").attr('src');
        changeConversation(username, picture);
    });
}

function changeUserTabInfo(username) {
    change_lastDate(username);
    var lDate = find_lastDate(username);
    var lMessage = find_lastMessage(username);

    if (lMessage.length > 25) {
        lMessage = lMessage.substring(0, 25);
        lMessage += " ...";
    }

    $("." + $.escapeSelector(username)).find("#uLastDate").text(lDate);
    $("." + $.escapeSelector(username)).find("#userLastText").text(lMessage);
}

function changeChatNavText(username, photo) {
    clearChatNavText();
    if (!username) username = "Zephyr";
    if (!photo) photo = "../static/images/logo/logo.svg";
    if (username == "Zephyr") photo = "../static/images/logo/logo.svg";
    var status = getUserStatus(username);
    if (!status) {
        status = "Inactive";
    }
    if (username == "Zephyr") status = "Active";
    $("#currentFriendInfoWrapper").append('<img id="currentFriendPic" src="' + photo + '" width="48px" height="48px"><div id="currentFriendInfo"><div id="currentFriendName"><h1 id="currentFriendName" class="display-5">' + username + '</h1> </div><div id="currentFriendStatus">' + status + '</div></div>');
}

function clearChatNavText() {
    $('#currentFriendInfoWrapper').html('');
}

$('#searchText').on('keypress', function (e) {
    if (e.keyCode == 13) {
        add_friendUser();
    }
});


$('#textInput').on('keypress', function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        sendMessage();
    }
});

function loadMessages(username) {
    index = findUserIndex(username);
    if (users[index].messages) {
        for (var i = 0; i < users[index].messages.length; i++) {
            var message = users[index].messages[i];
            if (message.type == "user") {
                if (lastMessageType == 1 || lastMessageType == 2) {
                    lastMessageType = 2;
                    if (message.encoding == "text") {
                        add_userMessage(message.text, message.time);
                    } else if (message.encoding == "image") {
                        add_userPictureUrl(message.text, message.time);
                    }
                } else if (lastMessageType == 3 || lastMessageType == 4 || lastMessageType == 0) {
                    lastMessageType = 1;

                    if (message.encoding == "text") {
                        add_firstUserMessage(message.text, message.time);
                    } else if (message.encoding == "image") {
                        add_firstUserPictureUrl(message.text, message.time);
                    }
                }
            } else if (message.type == "friend") {
                if (lastMessageType == 1 || lastMessageType == 2 || lastMessageType == 0) {
                    lastMessageType = 3;

                    if (message.encoding == "text") {
                        add_firstFriendMessage(message.text, message.time);
                    } else if (message.encoding == "image") {
                        add_firstFriendPictureUrl(message.text, message.time);
                    }
                } else if (lastMessageType == 3 || lastMessageType == 4) {
                    lastMessageType = 4;

                    if (message.encoding == "text") {
                        add_friendMessage(message.text, message.time);
                    } else if (message.encoding == "image") {
                        add_firstFriendMessage(message.text, message.time);
                    }
                }
            }
        }
    }
}

//last message types
/*
1 - first user
2 - user
3 - first friend
4 - friend
*/
var lastMessageType = 0;
var yourUserName = $("#profilePic").first().attr("alt");
//var active_Conversation = id;

function sendMessage() {
    var message = $('#textInput').val();
    var target = $('#currentFriendName').text();
    target = target.trim();
    if (message) {
        // $('#sendButton').animateCss('fadeOutRight');
        if (lastMessageType == 1) {
            lastMessageType = 2;
            emitMessage(message, "text", getTime(), target);
            add_userMessage(message);
            $('#textInput').val('');
            $('#textInput').attr('rows', '1');
        } else if (lastMessageType == 2) {
            emitMessage(message, "text", getTime(), target);
            add_userMessage(message);
            $('#textInput').val('');
            $('#textInput').attr('rows', '1');
        } else if (lastMessageType == 3 || lastMessageType == 4 || lastMessageType == 0) {
            lastMessageType = 1;
            emitMessage(message, "text", getTime(), target);
            add_firstUserMessage(message);
            $('#textInput').val('');
            $('#textInput').attr('rows', '1');
        }
        add_message(getCurrentFriend(), {
            text: message,
            time: getTime(),
            type: "user",
            encoding: "text"
        });
    }
}

function emitMessage(message, type, time, target) {
    socket.emit('message', {
        type: type,
        message: message,
        time: time,
        target: target
    });
}

function showNewMessage(message, time) {
    if (lastMessageType == 1 || lastMessageType == 2 || lastMessageType == 0) {
        lastMessageType = 3;
        add_firstFriendMessage(message, time);
    } else if (lastMessageType == 3) {
        lastMessageType = 4;
        add_friendMessage(message, time);
    } else {
        add_friendMessage(message, time);
    }
}

function showNewImage(message, time) {
    if (lastMessageType == 1 || lastMessageType == 2 || lastMessageType == 0) {
        lastMessageType = 3;
        add_firstFriendPictureUrl(message, time);
    } else if (lastMessageType == 3) {
        lastMessageType = 4;
        add_friendPictureUrl(message, time);
    } else {
        add_friendPictureUrl(message, time);
    }
}

function changeConversation(newUser, picture) {
    lastMessageType = 0;
    clearChatWindow();
    loadMessages(newUser);
    changeChatNavText(newUser, picture);
}

function checkStatuses(user) {
    if (getCurrentFriend() == user) {
        changeChatNavText(getCurrentFriend(), getCurrentPicture());
    }
}

$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = (function (el) {
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
            }
        })(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});

$("#photoButton").click(function () {
    $("#uploadPhoto").click();
});

$("#uploadPhoto").click(function () {
    this.value = null;
});

$("#uploadPhoto").on("change", function () {
    sendImage(this.files[0], 2);
});

function getTime() {
    var d = new Date();
    if (d.getMinutes() < 10) {
        time = d.getHours() + ":0" + d.getMinutes();
    } else {
        time = d.getHours() + ":" + d.getMinutes();
    }
    return time;
}

$("#chatMenuButton").click(function () {
    $("#main").removeClass("leftMenu");
    $("#main").addClass("rightMenu");
});


$("#mainMenuButton").click(function () {
    $("#main").removeClass("rightMenu");
    $("#main").addClass("leftMenu");
});

function logOut() {
    fetch('logout', {
        method: 'get',
        credentials: 'include'

    }).then(function (response) {
        if (response.redirected) {
            return window.location.replace(response.url);
        }

    }).catch(function (err) {
        console.log(err);
    });
}
var socket = io.connect();

socket.on('message', function (data) {
    if (data.type == 'text') {
        if (data.sender == getCurrentFriend()) {
            showNewMessage(data.message, data.time);
        }
    } else if (data.type == 'image') {
        if (data.sender == getCurrentFriend()) {
            showNewImage(data.message, data.time);
        }
    }
    var index = findUserIndex(data.sender);
    var showNewTab = false;
    if (index == -1) {
        showNewTab = true;
    }
    else
    {
        users[index].status = "Active";
        checkStatuses(users[index].username);
    }

    add_message(data.sender, {
        text: data.message,
        time: data.time,
        type: "friend",
        encoding: data.type
    }, showNewTab);
});

socket.on('username', function (data) {
    socket.emit('login', {
        username: yourUserName
    });
    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isSafari) {
        var cssId = 'chat_safari';
        if (!document.getElementById(cssId)) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = '../static/css/chat_safari.css';
            link.media = 'all';
            head.appendChild(link);
        }
    }
});


socket.on('statusUpdate', function (data) {
    var index = findUserIndex(data.name);
    if (index != -1) {
        users[index].status = data.status;
        checkStatuses(users[index].username);
    }
});


var users = [];

function add_user(username, status, lastDate, messages) {
    var index = findUserIndex(username);
    if (index == -1) {
        if (!messages) messages = [];
        if (!status) status = "Inactive";
        if (!lastDate) lastDate = "00:00";
        users.push({
            username: username,
            status: status,
            lastDate: lastDate,
            messages: messages
        });
    }
}

function add_message(username, message, addTab) {
    var index = findUserIndex(username);
    if (index != -1) {
        users[index].messages.push(message);
    } else {
        add_user(username, "Active", getTime());
        index = findUserIndex(username);
        users[index].messages.push(message);
    }
    if (addTab == true) {
        addUserTab(username);
    }
    changeUserTabInfo(username);
}

function change_status(username, status) {
    var index = findUserIndex(username);
    if (index != -1) {
        users[index].status = status;
    }
}

function change_lastDate(username) {
    var index = findUserIndex(username);
    if (index != -1) {
        var last = users[index].messages.length - 1;
        users[index].lastDate = users[index].messages[last].time;
    }
}

function find_lastMessage(username) {
    var index = findUserIndex(username);
    if (index != -1) {
        var last = users[index].messages.length - 1;
        if (users[index].messages[last].encoding == "image") {
            return "Photo";
        } else return users[index].messages[last].text;
    }
}

function find_lastDate(username) {
    change_lastDate(username);
    var index = findUserIndex(username);
    if (index != -1) {
        return users[index].lastDate;
    }
}

function getUserStatus(username) {
    var index = findUserIndex(username);
    if (index != -1) {
            return users[index].status;
    }
}

function findUserIndex(username) {
    for (var i = 0, len = users.length; i < len; i++) {
        if (users[i].username == username) {
            return i;
        }
    }
    return -1;
}

function getCurrentFriend() {
    var username = $('#currentFriendName').text();
    username = username.trim();
    return username;
}

function getCurrentPicture() {
    var picture = $('#currentFriendPic').attr('src');
    return picture;
}