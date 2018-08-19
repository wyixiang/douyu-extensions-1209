Object.defineProperties(Date.prototype, {
    format: {
        value: function value(fmt) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }return fmt;
        }
    }
});

Object.defineProperties(String.prototype, {
    startsWith: {
        value: function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        }
    },
    endsWith: {
        value: function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        }
    },
    contains: {
        value: function (string) {
            return this.indexOf(string) !== -1;
        }
    }
});

function randomNumber(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

function values(obj) {
    var ret = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            ret.push(obj[i]);
    }
    return ret;
}

function keys(obj) {
    var ret = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            ret.push(i);
    }
    return ret;
}

if (chrome.hasOwnProperty('storage')) {
    window.LS = {
        CSL: chrome.storage.local,
        Load: function Load(key, defVal, callback) {
            this.CSL.get(key, function (val) {
                if (typeof defVal === 'function') {
                    callback = defVal;
                    defVal = undefined;
                }

                if (Object.getOwnPropertyNames(val).length === 0) {
                    callback(defVal);
                } else {
                    callback(val[key]);
                }
            });
        },
        Save: function Save(key, val, callback) {
            var obj = {};
            obj[key] = val;
            this.CSL.set(obj, callback);
        }
    };
}

function waitElm(query, time, callback) {
    if (typeof time === 'function') {
        callback = time;
        time = 500;
    }
    var elm = $(query);
    if (elm.length === 0) setTimeout(waitElm.bind(this, query, callback), time);
    else callback(elm);
}

function getDateTime(time) {
    var date = new Date();
    if (time) {
        if (time > ONE_DAY_MS) date = new Date(time);else date.setDate(date.getDate() + time);
    }
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
}

function getNowDate(time) {
    return (time ? new Date(getDateTime(time)) : new Date()).format('yyMMdd');
}

function playAudio(src, vol) {
    var audio = new Audio();
    audio.src = src;
    audio.volume = vol || 1;
    audio.play();
}