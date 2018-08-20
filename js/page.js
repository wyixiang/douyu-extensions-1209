window.switchStates = defaultSwitchStates;
window.config = defaultConfig;
var elmPeck, elmPeckCdn;
var _rules = [], regAt, nickname;

window.addEventListener("message", function(event) {
    if (event.source !== window || event.data['msgOrigin'] !== 'content')
        return;

    delete event.data['msgOrigin'];
    onContentMsg(event.data);
}, false);

function onSwitchChange(name, switched) {
    switch (name) {
        case 'AutoGetGift':
            if (switched) {
                if (window.obsAGG) {
                    checkGiftAndGet();
                } else {
                    window.obsAGG = new MutationObserver(checkGiftAndGet);
                    waitElm(".peck", function (elm) {
                        elmPeck = elm;
                        waitElm('.peck-cdn', function (elm) {
                            window.obsAGG.observe(elmPeckCdn = elm[0], { childList: true });
                            checkGiftAndGet();
                        });
                    });
                }
            }
            break;
        case 'ChatController':
            var chatControlBtn = $('.chatControlBtn');
            if (switched) {
                waitElm(".speak-up", function (elmSpeakUp) {
                    if (chatControlBtn.length === 0) {
                        $(".shie-switch span span:contains('屏蔽全部特效')").text("屏蔽全部");
                        chatControlBtn = $("<div class='chatControlBtn shie-gift'><img src='" + data.iconUrl + "' width=\"20\" height=\"20\"></div>");

                        var chatControl = $("<div class='chatControl shie-site-list'></div>");
                        for (var i = 0; i < data.ChatSwitchList.length; i++) {
                            (function (key) {
                                var btn, dd = $('<dd class="shie-input ' + (switchStates[key] ? 'shie-checked' : '') + '" switch="' + key + '" title="' + Switch[key].tip + '"><div class="shie-checkbox-icon"></div><a><span>' + Switch[key].CN + '</span></a></dd>');
                                dd.click(function () {
                                    var nowState = dd.hasClass('shie-checked');
                                    dd[!nowState ? 'addClass' : 'removeClass']('shie-checked');
                                    if (key !== 'PreventLag') {
                                        sendMsgToBack({ type: MSG_TYPE.UpdateSwitch, name: key, switched: !nowState });
                                    } else {
                                        switchStates[key] = !nowState;
                                        onSwitchChange(key, switchStates[key]);
                                    }
                                });
                                if (key === 'AutoMute') {
                                    var div = $("<div class=\"btnConcise configAutoMute\">设置禁言规则</div>");
                                    initConfigAutoMute(div);
                                    chatControl.append(div);
                                } else if (key === 'HideChat') {
                                    btn = $('<div id="ShowChatTip">显示聊天</div>');
                                    btn.click(function () {
                                        dd.removeClass('shie-checked');
                                        sendMsgToBack({ type: MSG_TYPE.UpdateSwitch, name: key, switched: false });
                                    });
                                    $("#js-chat-cont").append(btn);
                                } else if (key === 'PreventLag') {
                                    btn = $('<div id="ShowChatTip2">关闭防卡模式</div>');
                                    btn.click(function () {
                                        dd.removeClass('shie-checked');
                                        sendMsgToBack({ type: MSG_TYPE.UpdateSwitch, name: key, switched: false });
                                    });
                                    $("#js-chat-cont").append(btn);
                                }
                                chatControl.append(dd);
                            })(data.ChatSwitchList[i]);
                        }
                        chatControl.append('<dd class="shie-site-list-arrow shie-site-list-arrow1"></dd><dd class="shie-site-list-arrow shie-site-list-arrow2"></dd>');

                        chatControlBtn.append(chatControl);
                        elmSpeakUp.append(chatControlBtn);
                    } else {
                        chatControlBtn.css('display', '');
                    }
                    setTimeout(function () { // async switch
                        for (var _name in Switch) {
                            if (Switch.hasOwnProperty(_name) && Switch[_name].type === 'chat')
                                onSwitchChange(_name, !!switchStates[_name]);
                        }
                    }, 0);
                });
            } else {
                if (chatControlBtn.length !== 0) {
                    chatControlBtn.css('display', 'none');
                    for (var _name in Switch) {
                        if (Switch.hasOwnProperty(_name) && Switch[_name].type === 'chat' && switchStates[_name])
                            onSwitchChange(_name, false);
                    }
                }
            }
            break;
        case 'AutoMute':
            $('.configAutoMute')[switched ? 'show' : 'hide']();
            if (switched)
                tryHookACJ();
            break;
        case 'HideChat':
            waitElm("body", function (elmBody) { elmBody.toggleClass(name, switched); });
            break;
        case 'ChatMode':
            waitElm("body", function (elmBody) { elmBody.toggleClass(name, switched); });
            if (switched && switchStates.ChatMode2)
                sendMsgToBack({ type: MSG_TYPE.UpdateSwitch, name: 'ChatMode2', switched: false });
            if (!switched)
                $("dd[switch=ChatMode]").removeClass("shie-checked");
            break;
        case 'ChatMode2':
            waitElm("body", function (elmBody) { elmBody.toggleClass(name, switched); });
            if (switched && switchStates.ChatMode)
                sendMsgToBack({ type: MSG_TYPE.UpdateSwitch, name: 'ChatMode', switched: false });
            if (!switched)
                $("dd[switch=ChatMode2]").removeClass("shie-checked");
            break;
        case 'ForceMute':
            if (switched)
                tryHookJsNickHandler();
            break;
        case 'ChatAt':
            if (switched) {
                tryHookACJ();
                tryHookJsNickHandler();
                nickname = document.cookie.match(/acf_nickname=(.*?);/);
                if (nickname) {
                    nickname = nickname[1];
                    regAt = new RegExp("@(全体|全体成员|所有人|" + nickname + ")(\\s|$)", 'gi');
                }
            }
            break;
        case 'PreventLag':
            waitElm("body", function (elmBody) { elmBody.toggleClass(name, switched); });
            if (switched)
                tryHookACJ();
            break;
    }
}

var handler_ORIGIN;
function tryHookJsNickHandler() {
    if (window._JNH)
        return;
    window._JNH = true;

    function tryHook() {
        var keys = Object.keys(document).filter(function (key) {
            return key.startsWith('jQuery');
        });
        keys.forEach(function (key) {
            var events = $.cache[document[key]].events.click || [];
            events.forEach(function (event) {
                if (window._JNH_HOOKED)
                    return;

                if (event.selector === '.js-nick') {
                    handler_ORIGIN = event.handler;
                    event.handler = handler_HOOK;

                    window._JNH_HOOKED = true;
                }
            });
        });
        if (!window._JNH_HOOKED)
            setTimeout(tryHook, 1000);
    }

    tryHook();
}

function handler_HOOK() {
    var ret = handler_ORIGIN.apply(this, arguments);
    if (switchStates.ForceMute || switchStates.ChatAt) {
        waitElm(".user-card-action-inr", 200, function (elmActions) {
            var tagA, name;
            if (switchStates.ForceMute) {
                tagA = $('<a class="action-item" data-type="mute2" href="javascript:;">强制禁言</a>');
                name = $(".user-card-title h1").text();
                tagA.on('click', function () {
                    forceMute(name, window['$ROOM'].room_id);
                });
                elmActions.append(tagA);
            }
            if (switchStates.ChatAt) {
                tagA = $('<a class="action-item" data-type="chatAt" href="javascript:;">At此人</a>');
                name = $(".user-card-title h1").text();
                tagA.on('click', function () {
                    var textArea = $(".cs-textarea");
                    textArea.val(textArea.val() + "@" + name + " ");
                    textArea.focus();
                });
                elmActions.append(tagA);
            }
        });
    }


    return ret;
}

var _ACJ_ORIGIN;
function tryHookACJ() {
    if (window._ACJ_HOOKED)
        return;
    window._ACJ_HOOKED = true;

    if(!window._ACJ_) {
        Object.defineProperty(window, "_ACJ_", {
            get: function () { return _ACJ_HOOK },
            set: function (value) { _ACJ_ORIGIN = value }
        });
    } else {
        _ACJ_ORIGIN = _ACJ_;
        window._ACJ_ = _ACJ_HOOK;
    }
}

function _ACJ_HOOK(dataArr) {
    if (switchStates.PreventLag) {
        var event = dataArr[0];
        if (event !== 'room_bus_pagescr' && event !== 'room_screenChange' && event !== 'rquiziln' && event !== 'rquizisn'
                && event !== 'quizprn' && event !== 'quen')
            return;
    }

    if(dataArr instanceof Array && dataArr[1]) {
        var pack = unserialize(dataArr[1]);
        if (pack.type === PACK_TYPE.Chat) {
            var chatInfo = genChatInfo(pack);
            if (switchStates.AutoMute) {
                var day = banKeywordsCheck(chatInfo);
                if (day)
                    forceMute(chatInfo.user.name, window['$ROOM'].room_id, day);
            }
            if (switchStates.ChatAt && regAt) {
                var isAdmin = (config.extAdmin ? config.extAdmin.indexOf(chatInfo.user.name) !== -1 : false) || chatInfo.user.role === 4 || chatInfo.user.role === 5;
                if (chatInfo.user.name !== nickname && (!switchStates.OnlyAdminAt || isAdmin)) {
                    var matchRet = chatInfo.txt.match(regAt);
                    if (matchRet) {
                        for (var i = 0; i < matchRet.length; i++) {
                            var res = matchRet[i].trim().substr(1), title;
                            if (res === nickname) {
                                title = chatInfo.user.name + " 在[" + window['$ROOM'].room_id + "]@了你";
                            } else if (isAdmin) {
                                title = chatInfo.user.name + " 在[" + window['$ROOM'].room_id + "]@了全体";
                            }
                            if (title) {
                                sendMsgToBack({ type: MSG_TYPE.Notify, title: title, body: chatInfo.txt, time: 4000 });
                                break;
                            }
                        }
                    }
                }
            }
        } /* else if (pack.type === PACK_TYPE.Rquiziln) {
            console.log(unserialize(pack.qril));
        } */
    }

    if(_ACJ_ORIGIN) _ACJ_ORIGIN.apply(this, arguments);
}

function banKeywordsCheck(chatInfo) {
    if (switchStates.PreventWrong) {
        // if (chatInfo.txt.length <= 8)
            // return 0;
        if (chatInfo.user.signRoom === window['$ROOM'].room_id && chatInfo.user.signLevel >= 2)
            return 0;
    }

    for (var i = 0; i < _rules.length; i++) {
        var rule = _rules[i];
        if (chatInfo.user.level > rule.lv)
            continue;

        if (typeof rule.key === 'string') {
            if (chatInfo.txt.toUpperCase().indexOf(rule.key) !== -1)
                return rule.day;
        } else {
            if (rule.key.test(chatInfo.txt))
                return rule.day;
        }
    }
    return 0;
}

function forceMute(name, roomId, dayOrMin) {
    if (!dayOrMin)
        dayOrMin = 30;
    if (!isNaN(dayOrMin)) {
        dayOrMin = dayOrMin * 60 * 24;
    } else if (dayOrMin.endsWith("m")) {
        dayOrMin = dayOrMin.substr(0, dayOrMin.length - 1);
    } else if (dayOrMin.endsWith("h")) {
        dayOrMin = (dayOrMin.substr(0, dayOrMin.length - 1)) * 60;
    }
    console.log(dayOrMin);
    $.post("https://www.douyu.com/room/roomSetting/addMuteUser", {
        ban_nickname: name,
        room_id: roomId,
        ban_time: dayOrMin
    }, function (res) {
        var success = false;
        try {
            res = JSON.parse(res);
            success = res.error === 1;
        } catch (err) {}
        if (!success && res.msg === "添加失败，该用户可能被全站禁言") {
            success = true;
        }
        $(".chat-cont-wrap .c-list").append('<li class="jschartli sys-msg" data-type="list" data-level="0"><p class="text-cont">' +
            name + (success ? ' 已被强制禁言' : (' 强制禁言失败: ' + res.msg)) + '</p></li>');
    });
}

function checkGiftAndGet() {
    if (!switchStates.AutoGetGift )//|| (switchStates.GetBoxHelp && config.boxLog.count > 100)
        return;

    if(elmPeckCdn.textContent === "领取" && $(".peck-check-box").is(':hidden')) setTimeout(function(){
        elmPeck.trigger("mouseenter");
        elmPeckCdn.click();
    }, Math.ceil(Math.random() * 100));
}

function initConfigAutoMute(btn) {
    var div = $('<div class="fans-barrage-box configAutoMuteDiv" data-tag="fans-barrage-list" data-type="cbl">\
                <div class="fans-barrage-title">\
                    <a class="fans-barrage-right fr">\
                        <em class="fans-barrage-last">查看规则格式</em>\
                    </a>\
                    <p>设置禁言规则</p>\
                </div>\
                <textarea spellcheck="false"></textarea>\
                <div class="fans-barrage-colordes">\
                    <a class="btnConcise save">保存</a>\
                    <a class="btnConcise cancel">取消</a>\
                </div>\
            </div>');
    var btnTip = div.find('.fans-barrage-right');
    var btnSave = div.find('.btnConcise.save');
    var btnCancel = div.find('.btnConcise.cancel');
    var textArea = div.find('textarea');

    btnTip.click(function () {
        alert('格式为每行一个规则, 每个规则有3个部分, 分别是:\n关键词, 上限等级, 自动封禁时长 (单位: 天)\n这些部分的分隔符为_~_\n\n发言者等级大于上限等级, 将自动忽略此条, 不进行规则匹配.\n' +
            '自动封禁时长是字面意思.\n关键词是在发言内容中匹配到后就进行封禁, \n如果关键词以regex:开头, 那么该关键词将以正则模式匹配弹幕.\n\n\n下面为2个例子:\n\n' +
            'test_~_5_~_30 当弹幕内容包含test时且发言者等级≤5, 将自动禁言30天, 该规则可简写为test, 因为默认的上限等级为5, 时长为30\n\n' +
            '禁言时间如果无后缀默认为天数, 有h后缀则为小时, m后缀为分钟, 如test_~_5_~_30m代表禁言30分钟\n' +
            'regex:Q群\\d{5,14}_~_5 该规则是正则匹配内容中包含Q群开头后跟5~14位数字的发言, 发言者等级≤5时, 将自动禁言30天');
    });
    btnCancel.click(function () {
        div.hide();
    });
    var separator = '_~_';
    btnSave.click(function () {
        var lines = textArea.val().split('\n');
        var rules = [];
        for (var i = 0, line = lines[i]; i < lines.length; i++, line = lines[i]) {
            if (!line)
                continue;

            var lineWords = line.split(separator);
            var key = lineWords[0],
                lv = Number(lineWords[1]),
                day = lineWords[2];

            if (!key || key.length <= 0)
                return alert('错误的关键词, 长度小于0');
            if (isNaN(lv))
                lv = 5;
            if (lineWords[2].endsWith("h") || lineWords[2].endsWith("m")) {
                if (isNaN(day.substr(0, day.length - 1))) {
                    day = 30;
                }
            } else if (isNaN(day)) {
                day = 30;
            }
            rules.push({ key: key, lv: lv, day: day });
        }
        sendMsgToBack({ type: MSG_TYPE.UpdateConfig, name: 'rules', val: rules });
        div.hide();
    });
    btn.click(function () {
        var configStr = '';
        for (var i = 0; i < config.rules.length; i++) {
            var rule = config.rules[i];
            configStr += rule.key + separator + rule.lv + separator + rule.day + "\n";
        }
        textArea.val(configStr);
        div.show();
    });
    $('.chat-speak').append(div);
    div.hide();
}

function cacheRules() {
    _rules = config.rules.map(function (rule) {
        if (rule.key.startsWith('regex:'))
            return { key: new RegExp(rule.key.replace('regex:', '')), lv: rule.lv, day: rule.day };
        return rule;
    });
}

/* receive msg */

function onContentMsg(data) {
    switch (data.type) {
        case MSG_TYPE.InitData:
            window.data = data.data;
            break;
        case MSG_TYPE.UpdateSwitch:
            switchStates[data.name] = data.switched;
            onSwitchChange(data.name, data.switched);
            break;
        case MSG_TYPE.UpdateSwitchAll:
            window.switchStates = data.switchStates;
            for (var name in Switch) {
                if (Switch.hasOwnProperty(name) && Switch[name].type !== 'chat')
                    onSwitchChange(name, switchStates[name]);
            }
            break;
        case MSG_TYPE.UpdateConfig:
            config[data.name] = data.val;
            if (data.name === 'rules')
                cacheRules();
            break;
        case MSG_TYPE.UpdateConfigAll:
            window.config = data.config;
            cacheRules();
            break;
        case MSG_TYPE.Refresh:
            if (!window.$ROOM || window.$ROOM.show_status !== 1)
                location.reload();
            break;
    }
}

function sendMsgToContent(data) {
    if (typeof data !== 'object')
        data = { type: data };
    data.msgOrigin = 'page';
    window.postMessage(data, location.origin);
}

function sendMsgToBack(data) {
    if (typeof data !== 'object')
        data = { type: data };
    sendMsgToContent({ type: MSG_TYPE.ContentForwardBack, data: data });
}

/* other */

/* function serialize(obj) {
    function SttEscape(str) {
        if (typeof str !== "string") str = str.toString();
        return str.replace(/@/g, "@A").replace(/@/g, "@A");
    }

    var keys = Object.getOwnPropertyNames(obj);
    var raw = "";
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = obj[key];
        raw += SttEscape(key) + "@=" + SttEscape(value) + "/";
    }
    return raw;
} */

function unserialize(raw) {
    if (typeof raw !== 'string') {
        if (typeof raw.data !== 'string')
            return {};
        raw = raw.data;
    }

    function _parse(str) {
        var list = [];
        if("/" !== str.charAt(str.length - 1))
            str += "/";

        var key = "", value = "";
        for (var i = 0; i < str.length; i++) {
            var char = str.charAt(i);
            if (char === "/") {
                list.push({
                    key: key,
                    value: value
                });
                key = "";
                value = "";
            } else if (char === "@") {
                char = str.charAt(++i);
                if (char === "A") {
                    value += "@";
                } else if (char === "S") {
                    value += "/";
                } else if (char === "=") {
                    key = value;
                    value = "";
                }
            } else {
                value += char;
            }
        }
        return list
    }

    var list = _parse(raw), obj = {};
    if (list.length === 1 && /@=/g.test(list[0].value)) {
        list = _parse(list[0].value);
    }

    for (var i = 0; i < list.length; i++) {
        obj[list[i].key] = list[i].value;
    }

    return obj;
}

function genUserInfo(pack) {
    if (pack.type === PACK_TYPE.Deserve) {
        var subPack = unserialize(pack['sui']);
        pack['uid'] = subPack['id'];
        pack['nn'] = subPack['nick'];
        pack['ic'] = subPack['icon'];
    }

    return {
        uid: "dy" + pack['uid'],
        name: pack['nn'],
        avatar: "https://apic.douyucdn.cn/upload/" + pack['ic'] + "_middle.jpg",
        level: Number(pack['level']),
        signName: pack['bnn'],
        signRoom: Number(pack['brid']),
        signLevel: Number(pack['bl']),
        role: Number(pack['rg'])
    };
}

function genChatInfo(pack) {
    return {
        user: genUserInfo(pack),
        txt: pack['txt'],
        cid: pack['cid']
    };
}

/* init */

sendMsgToContent(MSG_TYPE.InitData);