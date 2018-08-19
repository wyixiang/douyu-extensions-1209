window.switchStates = defaultSwitchStates;
window.config = defaultConfig;
LS.Load("switchStates", {}, function (val) {
    Object.assign(defaultSwitchStates, val);
    window.switchStates = defaultSwitchStates;
    for (var name in Switch) {
        if (Switch.hasOwnProperty(name))
            onSwitchChange(name, switchStates[name]);
    }
});
LS.Load("config", {}, function (val) {
    Object.assign(defaultConfig, val);
    window.config = defaultConfig;
    onSwitchChange('LiveTip', switchStates.LiveTip);
});

chrome.extension.onMessage.addListener(onMsg);

function onSwitchChange(name, switched) {
    switch (name) {
        case 'LiveTip':
            if (config.hasOwnProperty('liveTipList') && switched)
                startLiveTipLoop();
            break;
    }
}

function onMsg(data, sender, ret) {
    switch (data.type) {
        case MSG_TYPE.UpdateSwitch:
            switchStates[data.name] = data.switched;
            onSwitchChange(data.name, data.switched);
            LS.Save("switchStates", switchStates);
            sendMsgToContent(data);
            break;
        case MSG_TYPE.UpdateConfig:
            config[data.name] = data.val;
            LS.Save("config", config);
            sendMsgToContent(data);
            break;
        case MSG_TYPE.Notify:
            notify(data.title, data.body, data.time);
            break;
        case MSG_TYPE.AudioTip:
            playAudio(chrome.extension.getURL("res/" + SoundList[config.soundIndex]), config.soundVolume / 10);
            break;
        case MSG_TYPE.GotBox:
            if (config.boxLog.date !== getNowDate())
                config.boxLog = { count: 0, date: getNowDate() };
            config.boxLog.count++;
            LS.Save("config", config);
            sendMsgToContent({ type: MSG_TYPE.UpdateConfig, name: 'boxLog', val: config.boxLog });
            break;
    }
}

function sendMsgToContent(data, callback) {
    if (typeof data !== 'object')
        data = { type: data };
    chrome.tabs.query({ url: "https://www.douyu.com/*" }, function(tabs){
        tabs.forEach(function (tab) {
            chrome.tabs.sendMessage(tab.id, data, callback);
        });
    });
}

function startLiveTipLoop() {
    for (var i = 0; i < config.liveTipList.length; i++) {
        var roomId = config.liveTipList[i];
        if (!lastCheckLiving.hasOwnProperty(roomId))
            checkLiveAndTip(roomId);
    }
}

var lastCheckLiving = {};
function checkLiveAndTip(roomId) {
    if (!switchStates.LiveTip) {
        return setTimeout(checkLiveAndTip.bind(this, roomId), 10 * 1000);
    }

    if (config.liveTipList.indexOf(roomId) === -1) {
        delete lastCheckLiving[roomId];
        return;
    }

    if (!lastCheckLiving.hasOwnProperty(roomId))
        lastCheckLiving[roomId] = false;

    $.getJSON("https://www.douyu.com/ztCache/WebM/room/" + roomId, function (data, status, xhr) {
        var $ROOM = JSON.parse(data['$ROOM']);
        var title = $ROOM['room_name'];
        var living = $ROOM['show_status'] === 1;

        if (!lastCheckLiving[roomId] && living) {
            notify("直播间 " + roomId + " 已开播", "直播间标题: " + title, 4000, "https://www.douyu.com/" + roomId);
            if (config.LiveTipAutoOpen) {
                chrome.tabs.query({ url: "https://www.douyu.com/*" }, function(tabs){
                    var havePage = false;
                    tabs.forEach(function (tab) {
                        var matchRet = tab.url.match(/\/\/www\.douyu\.com\/(t\/)?(shengdian10m)?(\d*)/i);
                        if (matchRet && matchRet.length >= 4) {
                            var _roomId = Number(matchRet[3]);
                            if (_roomId === roomId) {
                                havePage = true;
                                chrome.tabs.sendMessage(tab.id, { type: MSG_TYPE.Refresh });
                            }
                        }
                    });
                    if (!havePage) {
                        open('https://www.douyu.com/' + roomId);
                    }
                });
            }
        }

        lastCheckLiving[roomId] = living;
        setTimeout(checkLiveAndTip.bind(this, roomId), living ? 2 * 60 * 1000 : (10 * 1000 + randomNumber(0, 5000)));
    }).error(function () {
        setTimeout(checkLiveAndTip.bind(this, roomId), 30 * 1000);
    });
}

function notify(title, body, time, url) {
    var not = new Notification(title, { icon: "res/icon.png", body: body });
    if (url) {
        not.onclick = function(){
            open(url);
            not.close();
        };
    }
    if (time) {
        setTimeout(not.close.bind(not), time);
    }
}

// AdBlock
chrome.webRequest.onBeforeRequest.addListener(function () {
    return { cancel: switchStates.AdBlock };
}, {
    urls: ["*://pubads.g.doubleclick.net/*", "*://staticlive.douyucdn.cn/common/simplayer/assets/gameAdversion.swf?*", "*://staticlive.douyucdn.cn/common/simplayer/assets/videoAd.swf?*"]
}, ["blocking"]);

// hook define
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (switchStates.AutoGiveGift || switchStates.GetBoxHelp || switchStates.ForbidTipCP || switchStates.RemoveBoxDelay)
        return { redirectUrl: chrome.extension.getURL("js/_dyl.js") };
},
{
    urls: ["*://shark.douyucdn.cn/perform/dist/dyl.js*"],
    types: ["script"]
}, ["blocking"]
);