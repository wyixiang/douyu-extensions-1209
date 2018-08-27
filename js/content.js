window.switchStates = defaultSwitchStates;
window.config = defaultConfig;
LS.Load("switchStates", {}, function (val) {
    Object.assign(defaultSwitchStates, val);
    window.switchStates = defaultSwitchStates;
    for (var name in Switch) {
        if (Switch.hasOwnProperty(name))
            onSwitchChange(name, switchStates[name]);
    }
    if (switchStates.AutoGiveGift)
        autoGiveGift();
    if (switchStates.RecordAssitant)
        recordAssitant();
});
LS.Load("config", {}, function (val) {
    Object.assign(defaultConfig, val);
    window.config = defaultConfig;
});

window.addEventListener("message", function(event) {
    if (event.source !== window || event.data['msgOrigin'] !== 'page')
        return;

    delete event.data['msgOrigin'];
    onPageMsg(event.data);
}, false);

chrome.extension.onMessage.addListener(onBackOrPopupMsg);

ImportScriptToPage("js/const.js");
ImportScriptToPage("js/util.js");
//ImportScriptToPage("js/record.js");

ImportStyleToPage("css/page.css");
ImportStyleToPage("css/gift.css");
ImportStyleToPage("css/record.css");
$(document).ready(ImportScriptToPage.bind(window, "js/page.js"));

function onSwitchChange(name, switched) {
    switch (name) {
        case 'AdBlock':
            waitElm("body", function (elmBody) { elmBody.toggleClass(name, switched); });
            break;
        case 'ForbidAutoJump':
            waitElm("body", function (elmBody) { elmBody.toggleClass(name, switched); });
            if (switched && !window._FBJ) {
                window._FBJ = setInterval(function(){
                    $(".v-con ul li a").eq(0).attr("href", 'javascript:;');
                }, 10 * 1000);
            } else {
                clearInterval(window._FBJ);
                delete window._FBJ;
            }
            break;
    }
}

function getChatSwitchList() {
    var _keys = keys(Switch);
    var list = [];
    for (var i in _keys) {
        if (_keys.hasOwnProperty(i)) {
            list[Switch[_keys[i]].index] = _keys[i];
        }
    }
    list = list.filter(function (key) {
        return Switch[key].type === 'chat';
    });
    return list;
}

/* receive msg */

function onPageMsg(data) {
    switch (data.type) {
        case MSG_TYPE.InitData:
            sendMsgToPage({ type: MSG_TYPE.InitData, data: {
                iconUrl: chrome.extension.getURL("res/dan.png"),
                wavDing: chrome.extension.getURL("res/ding.wav"),
                ChatSwitchList: getChatSwitchList()
            } });
            sendMsgToPage({ type: MSG_TYPE.UpdateSwitchAll, switchStates: switchStates });
            sendMsgToPage({ type: MSG_TYPE.UpdateConfigAll, config: config });
            break;
        case MSG_TYPE.ContentForwardBack:
            sendMsgToBackAndPopup(data.data);
            break;
    }
}

function onBackOrPopupMsg(data, sender, ret) {
    switch (data.type) {
        case MSG_TYPE.UpdateSwitch:
            switchStates[data.name] = data.switched;
            onSwitchChange(data.name, data.switched);
            sendMsgToPage(data);
            break;
        case MSG_TYPE.UpdateConfig:
            config[data.name] = data.val;
            sendMsgToPage(data);
            break;
        case MSG_TYPE.Refresh:
            sendMsgToPage(data);
            break;
    }
}

/* send msg */

function sendMsgToPage(data) {
    if (typeof data !== 'object')
        data = { type: data };
    data.msgOrigin = 'content';
    window.postMessage(data, location.origin);
}

function sendMsgToBackAndPopup(data, callback) {
    if (typeof data !== 'object')
        data = { type: data };
    chrome.extension.sendMessage(data, callback);
}

/* util */

function ImportScriptToPage(src) {
    var newElement = document.createElement("script");
    newElement.setAttribute("type","text/javascript");
    newElement.setAttribute("src", chrome.extension.getURL(src));
    document.body.appendChild(newElement);
}

function ImportStyleToPage(src) {
    var newElement = document.createElement("link");
    newElement.setAttribute("rel","stylesheet");
    newElement.setAttribute("type","text/css");
    newElement.setAttribute("href", chrome.extension.getURL(src));
    document.head.appendChild(newElement);
}