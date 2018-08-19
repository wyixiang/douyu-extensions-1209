app = angular.module('app');
app.controller('popupController', popupController);

function popupController($scope) {
    var switchStates = $scope.switchStates = defaultSwitchStates;
    var models = $scope.models = {};
    var bgPage = $scope.bgPage = chrome.extension.getBackgroundPage();

    function main() {
        // read switch states
        LS.Load("switchStates", {}, function (val) {
            Object.assign(defaultSwitchStates, val);
            switchStates = $scope.switchStates = defaultSwitchStates;
            var _keys = keys(CONST.Switch);
            for (var i in _keys) {
                if (_keys.hasOwnProperty(i)) {
                    switchStates[_keys[i]] = !!switchStates[_keys[i]];
                }
            }
            apply();
        });
    }

    $scope.getSwitchList = function () {
        var _keys = keys(CONST.Switch);
        var list = [];
        for (var i in _keys) {
            if (_keys.hasOwnProperty(i)) {
                list[CONST.Switch[_keys[i]].index] = _keys[i];
            }
        }
        list = list.filter(function (key) {
            return CONST.Switch[key].type === undefined;
        });
        return list;
    };

    $scope.switch = function (name, switched) {
        switchStates[name] = switched;
        sendMsgToBack({ type: MSG_TYPE.UpdateSwitch, name: name, switched: switched });
    };

    $scope.openConfig = function (name) {
        var target = $('.config' + name);
        var expanded = !target.hasClass('expanded');
        target[expanded ? 'addClass' : 'removeClass']('expanded');
        if (expanded && name === 'LiveTip') {
            models.configLiveTip = bgPage.config.liveTipList.join(', ');
        }
    };

    $scope.ConfigLiveTip = function (save) {
        if (save) {
            var arr = models.configLiveTip.replace("，", ",").split(',');
            for (var i = 0; i < arr.length; i++) {
                var roomId = Number(arr[i]);
                if (isNaN(roomId) || roomId < 1) {
                    return alert("错误的直播间号: " + arr[i]);
                }
                arr[i] = roomId;
            }
            bgPage.config.liveTipList = arr;
            bgPage.startLiveTipLoop();
            LS.Save("config", bgPage.config);
        }
        $scope.openConfig('LiveTip');
    };

    $scope.ConfigGetBoxHelp = function (type, index, val) {
        LS.Save("config", bgPage.config);
        if (type === 1) {
            playAudio(chrome.extension.getURL("res/" + SoundList[index]), bgPage.config.soundVolume / 10);
        }
    };

    $scope.changeConfig = function (name, val) {
        bgPage.config[name] = val;
        sendMsgToBack({ type: MSG_TYPE.UpdateConfig, name: name, val: val });
    };

    $scope.openUrl = function (url) {
        open(url);
    };

    $scope.getNowCount = function () {
        if (bgPage.config.boxLog.date !== getNowDate()) {
            bgPage.config.boxLog = { count: 0, date: getNowDate() };
            sendMsgToBack({ type: MSG_TYPE.UpdateConfig, name: "boxLog", val: bgPage.config.boxLog });
        }
        return bgPage.config.boxLog.count;
    };

    $scope.clearBoxCount = function () {
        bgPage.config.boxLog = { count: 0, date: getNowDate() };
        sendMsgToBack({ type: MSG_TYPE.UpdateConfig, name: "boxLog", val: bgPage.config.boxLog });
    };

    var applying = false, needApply = false;
    function apply() {
        if (applying) {
            needApply = true;
            return;
        }
        applying = true;
        $scope.$apply();
        applying = false;
        if (needApply) {
            needApply = false;
            apply();
        }
    }

    main();
}

function sendMsgToBack(data, callback) {
    if (typeof data !== 'object')
        data = { type: data };
    chrome.extension.sendMessage(data, callback);
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