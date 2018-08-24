!function(){var t={cookie_pre:"_dys_",page_refer_cookie:"page_refer3",page_refer_max_count:10},e=function(t){t=t||window;var n,i,a=t.document,o=function(e){var n=!1;if(e.getBoundingClientRect){var i=e.getBoundingClientRect();n={top:Math.max(i.top,0),left:Math.max(i.left,0),bottom:Math.min(i.bottom,t.innerHeight||a.documentElement.clientHeight),right:Math.min(i.right,t.innerWidth||a.documentElement.clientWidth)},n.bottom<=n.top||n.right<=n.left?n=!1:n.area=(n.bottom-n.top)*(n.right-n.left)}return n},r=function(t,e){if(e){var n=o(t);n&&f.push({url:e,area:n.area,rect:n})}},d=function(){for(var n=a.getElementsByTagName("*"),i=/url\(.*(http.*)\)/gi,d=0;d<n.length;d++){var s=n[d],c=t.getComputedStyle(s);if("IMG"==s.tagName&&r(s,s.src),c["background-image"]){i.lastIndex=0;var m=i.exec(c["background-image"]);m&&m.length>1&&r(s,m[1].replace('"',""))}if("IFRAME"==s.tagName)try{var u=o(s);if(u){var h=e(s.contentWindow);h&&f.push({tm:h,area:u.area,rect:u})}}catch(v){}}},s=function(){for(var e={},n=t.performance.getEntriesByType("resource"),i=0;i<n.length;i++)e[n[i].name]=n[i].responseEnd;for(var a=0;a<f.length;a++)"tm"in f[a]||(f[a].tm=void 0!==e[f[a].url]?e[f[a].url]:0)},c=function(){if("msFirstPaint"in t.performance.timing&&(n=t.performance.timing.msFirstPaint-l),"chrome"in t&&"loadTimes"in t.chrome){var e=t.chrome.loadTimes();if("firstPaintTime"in e&&e.firstPaintTime>0){var i=e.startLoadTime;"requestTime"in e&&(i=e.requestTime),e.firstPaintTime>=i&&(n=1e3*(e.firstPaintTime-i))}}if(void 0===n||0>n||n>12e4){n=t.performance.timing.responseStart-l;for(var o={},r=a.getElementsByTagName("head")[0].children,d=0;d<r.length;d++){var s=r[d];"SCRIPT"==s.tagName&&s.src&&!s.async&&(o[s.src]=!0),"LINK"==s.tagName&&"stylesheet"==s.rel&&s.href&&(o[s.href]=!0)}for(var c=t.performance.getEntriesByType("resource"),m=!1,u=0;u<c.length;u++)if(m||!o[c[u].name]||"script"!=c[u].initiatorType&&"link"!=c[u].initiatorType)m=!0;else{var f=c[u].responseEnd;(void 0===n||f>n)&&(n=f)}}n=Math.max(n,0)},m=function(){for(var e={0:0},i=0,o=0;o<f.length;o++){var r=n;"tm"in f[o]&&f[o].tm>n&&(r=f[o].tm),void 0===e[r]&&(e[r]=0),e[r]+=f[o].area,i+=f[o].area}var d=Math.max(a.documentElement.clientWidth,t.innerWidth||0)*Math.max(a.documentElement.clientHeight,t.innerHeight||0);if(d>0&&(d=Math.max(d-i,0)*v,void 0===e[n]&&(e[n]=0),e[n]+=d,i+=d),i){for(var s in e)e.hasOwnProperty(s)&&h.push({tm:s,area:e[s]});h.sort(function(t,e){return t.tm-e.tm});for(var c=0,m=0;m<h.length;m++)c+=h[m].area,h[m].progress=c/i}},u=function(){if(h.length){i=0;for(var t=0,e=0,a=0;a<h.length;a++){var o=h[a].tm-t;o>0&&1>e&&(i+=(1-e)*o),t=h[a].tm,e=h[a].progress}}else i=n},f=[],h=[],v=.1;try{var l=t.performance.timing.navigationStart;d(),s(),c(),m(),u()}catch(p){}return void 0!==i?parseInt(i):-1},n={set:function(e,n,i,a,o){e=t.cookie_pre+e,o=o?"; path="+o:"/",a=a?";domain="+a:"";var r=new Date;r.setTime(r.getTime()+24*i*60*60*1e3);var d="expires="+r.toUTCString();document.cookie=e+"="+n+"; "+d+o+a},hasKey:function(e){var n;return e=t.cookie_pre?t.cookie_pre+e:e,n=document.cookie.match(new RegExp("(^| )"+e+"=")),null!==n},get:function(e,n){e=(n||t.cookie_pre)+e+"=";for(var i=document.cookie.split(";"),a=0;a<i.length;a++){for(var o=i[a];" "==o.charAt(0);)o=o.substring(1);if(-1!=o.indexOf(e))return o.substring(e.length,o.length)}return""},list:function(){for(var e=document.cookie.split(";"),n=[],i=0;i<e.length;i++){for(var a=e[i];" "==a.charAt(0);)a=a.substring(1);if(-1!=a.indexOf(t.cookie_pre)){var o=a.split("="),r=o[0],d=o[1];r&&(r=r.replace(t.cookie_pre,"")),n.push({key:r,value:d})}}return n},remove:function(t,e,n){this.hasKey(t)&&this.set(t,"",-1,n,e)},clear:function(){for(var t=this.list(),e=0,n=t.length;n>e;e++)this.remove(t[e].key)}},i={save:function(t,e,i){var a=location.host.split("."),o="";a=a.slice(a.length-2),a.unshift(""),o=a.join("."),n.set(t,e,i||1,o,"/")},get:function(t,e){return n.get(t,e)},remove:function(t,e){n.remove(t,"/")},clear:function(){n.clear()}},a={url:"https://apm.douyucdn.cn/deliver/perform"},o=function(){var t=window.performance&&window.performance.timing||null;t&&this.performanceBinder()};o.prototype={odata:[{name:"did",nick:"d",value:function(){var t=window.$SYS||{};return i.get("did",t.cookie_pre)||""}},{name:"uid",nick:"i",value:function(){var t=window.$SYS||{};return i.get("uid",t.cookie_pre)||0}},{name:"rid",nick:"rid",value:function(){return window.$ROOM&&$ROOM.room_id?$ROOM.room_id:0}},{name:"url",nick:"u",value:location.pathname},{name:"refer",nick:"ru",value:document.referrer},{name:"action_code",nick:"ac",value:"browser_apm"},{name:"ref_page_code",nick:"rpc",value:""},{name:"page_code",nick:"pc",value:""},{name:"page_t",nick:"pt",value:function(){return 0}},{name:"occur_t",nick:"oct",value:function(){return parseInt((new Date).getTime(),10)}},{name:"duration",nick:"dur",value:function(){return 0}},{name:"pro_code",nick:"pro",value:function(){return"host_site"}},{name:"ct_code",nick:"ct",value:"web"},{name:"ext",nick:"e",value:""}],keys:[{name:"domain",alias:"do",value:a.domain||window.location.host},{name:"browserType",alias:"bws",value:function(){return this.detectBrowser()}},{name:"DNSQueryTime",alias:"clc",value:function(){return void 0===this.t.domainLookupEnd||void 0===this.t.domainLookupStart?-1:this.t.domainLookupEnd-this.t.domainLookupStart}},{name:"TTFB",alias:"ttfb",value:function(){return void 0===this.t.responseStart||void 0===this.t.navigationStart?-1:this.t.responseStart-this.t.navigationStart}},{name:"BadTime",alias:"dl",value:function(){return void 0===this.t.domLoading||void 0===this.t.fetchStart?-1:this.t.domLoading-this.t.fetchStart}},{name:"operableTime",alias:"dcle",value:function(){return void 0===this.t.domContentLoadedEventEnd||void 0===this.t.navigationStart?-1:this.t.domContentLoadedEventEnd-this.t.navigationStart}},{name:"loadingCompletedTime",alias:"pl",value:function(){return void 0===this.t.loadEventEnd||void 0===this.t.navigationStart?-1:this.t.loadEventEnd-this.t.navigationStart}},{name:"domParse",alias:"dp",value:function(){return void 0===this.t.domInteractive||void 0===this.t.domLoading?-1:this.t.domInteractive-this.t.domLoading}},{name:"firstPaint",alias:"fp",value:function(){return void 0!==this.entries?void 0===this.entries.filter(function(t){return"first-paint"===t.name})[0]?-1:this.entries.filter(function(t){return"first-paint"===t.name})[0].startTime.toFixed(0):-1}},{name:"domcontentLoaded",alias:"dcld",value:function(){return void 0===this.t.domContentLoadedEventEnd||void 0===this.t.navigationStart?-1:this.t.domContentLoadedEventEnd-this.t.navigationStart}},{name:"domCount",alias:"dc",value:function(){return document?void 0===document.getElementsByTagName("*").length?-1:document.getElementsByTagName("*").length:-1}},{name:"tcpConnect",alias:"tcp",value:function(){return void 0===this.t.connectEnd||void 0===this.t.connectStart?-1:this.t.connectEnd-this.t.connectStart}},{name:"speedIndex",alias:"si",value:function(){return void 0===this.RUMSpeedIndex?-1:this.RUMSpeedIndex}},{name:"domContentLoad",alias:"dcl",value:function(){return void 0===this.t.domContentLoadedEventStart||void 0===this.t.domLoading?-1:this.t.domContentLoadedEventStart-this.t.domLoading}},{name:"domComplete",alias:"dcp",value:function(){return void 0===this.t.domComplete||void 0===this.t.domLoading?-1:this.t.domComplete-this.t.domLoading}}],performanceBinder:function(){var t=this;window.onload=function(){setTimeout(function(){t.performance()},0)}},performance:function(){var t=window.performance.timing;if(!(t.loadEventEnd<=0||t.navigationStart<=0||t.loadEventEnd<=t.navigationStart)){var e,n,i=this,o={},r={};r=i.makeOdata(i,arguments),e=i.makePerformanceInit.apply(i,arguments),r.e=e,o.multi=[r],o.v=1.5,n=a.url,i.send("POST",n,o)}},defval:function(t){return"function"==typeof t?t.call(this):t},makePerformanceInit:function(){this.t=window.performance.timing,void 0!==window.performance.getEntries?this.entries=window.performance.getEntries():this.entries=void 0,this.RUMSpeedIndex=e();var t={};for(var n in this.keys)t[this.keys[n].alias]=this.defval(this.keys[n].value);return t},makeOdata:function(){var t={};for(var e in this.odata)t[this.odata[e].nick]=this.defval(this.odata[e].value);return t},detectBrowser:function(){var t,e={},n=navigator.userAgent.toLowerCase();return(t=n.match(/msie ([\d.]+)/))?e.ie=t[1]:(t=n.match(/firefox\/([\d.]+)/))?e.firefox=t[1]:(t=n.match(/chrome\/([\d.]+)/))?e.chrome=t[1]:(t=n.match(/opera.([\d.]+)/))?e.opera=t[1]:(t=n.match(/version\/([\d.]+).*safari/))?e.safari=t[1]:0,!e.ie&&n.match(/trident/)&&(e.ie=n.match(/rv:([\d].)/)[1]),n.match(/edge\/([(\d).]+)/)&&(e.edge=n.match(/edge\/([(\d).]+)/)[1]),this.Sys=e,e.ie?"IE: "+e.ie:e.edge?"Edge: "+e.edge:e.firefox?"Firefox: "+e.firefox:e.chrome&&!document.getBoxObjectFor?"Chrome: "+e.chrome:e.opera?"Opera: "+e.opera:e.safari?"Safari: "+e.safari:void 0},param:function(t){var e=[];for(var n in t)e.push(n+"="+escape(JSON.stringify(t[n])));return e.join("&")},send:function(t,e,n,i,a){var o=null;if(window.XMLHttpRequest){o=new XMLHttpRequest,this.Sys&&this.Sys.ie&&this.Sys.ie<10&&(o=new window.XDomainRequest);var t=t.toUpperCase(),r=Math.random();if("GET"==t){var d=this.param(n);n?o.open("GET",e+"?"+d,!0):o.open("GET",e+"?t="+r,!0),o.send()}else"POST"==t&&(o.open("POST",e,!0),o.send(this.param(n)));o.onreadystatechange=function(){4==o.readyState&&(200==o.status?"function"==typeof i&&i(o.responseText):"function"==typeof a&&a(o.status))}}}},window.DYL=new o}();

// init temp
window.switchStates = {};

// hook define
var define_ORIGIN;
Object.defineProperty(window, "define", {
    get: function () { if (define_ORIGIN) return define_HOOK },
    set: function (value) { if (!define_ORIGIN) define_ORIGIN = value }
});

function define_HOOK() {
    try {
        var moduleName = arguments[0], libs = arguments[1], moduleFun = arguments[2];
        if (arguments.length === 1) {
            moduleFun = moduleName;
            moduleName = undefined;
        } else if (arguments.length === 2) {
            moduleFun = libs;
            libs = moduleName;
            moduleName = undefined;
        }

        var struct, dataPropName;
        if (moduleName === "douyu/page/room/normal/mod/backpack" || moduleName === "douyu/page/room/webm/mod/backpack") {
            struct = resolveFun(moduleFun);
            dataPropName = struct.codes.match(/useProp:function\(.\){if\(!(.)\.sending\)/)[1];
            var observerPropName = struct.args.split(",")[1];

            struct.codes = struct.codes.replace(
                '内可连击</span>\',"    </div>",',
                '内可连击</span>\',"    </div>",\'\
                    <% batchPreset = [10,66,520]; %>\
                    <% if ( AutoGiveGift && prop.count>9 ) { %>\
                        <div class="gift-info-panel-give gift-info-panel-give-not-explain" data-type="gift-info-give">\
                            <div class="gift-info-panel-form" style="display: block;" data-gid="<%=giftid%>" data-type="gift-info-panel-form">\
                                <a href="javascript:;" class="gift-info-panel-form-send all" style="margin-left: 4px;" data-type="batch-send" data-propid="<%= prop.prop_id%>" data-index="<%= prop.index%>">全部赠送</a>\
                                <span class="justify-fix"></span>\
                            </div>\
                        </div>\
                    <% } %>\
                \','
            );
            struct.codes = struct.codes.replace(
                '{prop:',
                '{AutoGiveGift:switchStates.AutoGiveGift,prop:'
            );
            struct.codes = struct.codes.replace(
                '.$wrap.on("mouseenter"',
                '.$wrap.on("click", "[data-gift-number]", function(a){\
                    a.stopPropagation();\
                    window.$(this).addClass("cur").siblings().removeClass("cur");            \
                }).on("click", "[data-type=\\"batch-send\\"]", function() {\
                    var num = window.$(".prop-info-panel [data-gift-number].cur").data("gift-number");\
                    var prop_id = window.$(this).data("propid");\
                    var index = window.$(this).data("index");\
                    var data = ' + dataPropName + ';\
                    var observer = ' + observerPropName + ';\
                    var prop = data.props[index];\
                    if (window.$(this).hasClass("all")) \
                        num = prop.count;\
                    if (window.config && window.config["QuickGift"]) {\
                        var maxTd = 10;\
                        var singleTdMax = Math.ceil(num / maxTd);\
                        var tdNum = Math.ceil(num / singleTdMax);\
                        var endReduce = tdNum * singleTdMax - num;\
                        for (var i = 0; i < tdNum; i++) {\
                            batchSend(singleTdMax - (i === tdNum - 1 ? endReduce : 0));\
                        }\
                    } else {\
                        batchSend(num);\
                    }\
                    function batchSend(num) {\
                        if (num <= 0) return;\
                        window.$.ajax({\
                            type: "post",\
                            url: "/member/prop/send",\
                            dataType: "json",\
                            data: {\
                                dy: window.$ROOM.device_id,\
                                prop_id: prop_id,\
                                num: 1,\
                                sid: window.$SYS.uid,\
                                did: window.$ROOM.owner_uid,\
                                rid: window.$ROOM.room_id,\
                                is_jz: 0\
                            },\
                            success: function(a) {\
                                if (0 === a.result) {\
                                    if (5 === prop.prop_type)\
                                        return data.reload(a.data), void data.rendertip(a);\
                                    prop.count -= 1;\
                                    data.fxPopExp(prop, a);\
                                    0 === prop.count ? data.reload(a.data) : (data.updatePanel(prop), data.updateProp(prop));\
                                    observer.trigger("room.giftprop.send.success.backland", prop.rel_id);\
                                    observer.trigger("mod.prop.hover.batter.search", prop.rel_id, index);\
                                    observer.trigger("room.gift.send.success.yearfestival", {\
                                        val: prop.intimate,\
                                        isProp: !0\
                                    });\
                                    batchSend(num - 1);\
                                } else {\
                                    window.$.dialog.tips_black(a.msg)\
                                }\
                            },\
                            error: function() {\
                                window.$.dialog.tips_black("网络错误！")\
                            }\
                        })\
                    }\
                }).on("mouseenter"'
            );
            arguments[Array.from(arguments).indexOf(moduleFun)] = parseFun(struct);
        } else if (moduleName === "douyu/page/room/normal/mod/gift/controller/treasure" || moduleName === "douyu/page/room/webm/mod/gift/controller/treasure") {
          struct = resolveFun(moduleFun);
          struct.codes = struct.codes.replace(
            '.geetest||{},',
            '.geetest||{};console.log("== geetest ==");\
            var json = arguments[0];\
            var geeTest = json.geetest || {};\
            if ((1 === json.validate || -2 === parseInt(json.code, 10)) && 0 === parseInt(geeTest.code, 10)) {\
                sendMsgToBack(MSG_TYPE.GotBox);\
                if (switchStates.GetBoxHelp && window.constInitialized && config.boxLog.count < 99) {\
                    sendMsgToBack(MSG_TYPE.AudioTip);\
                    if (!document.title_src) {\
                        document.title_src = document.title;\
                        document.title = "[新箱子验证] " + document.title;\
                        setTimeout(function () {\
                            if (document.hidden) {\
                                setTimeout(arguments.callee, 1000);\
                            } else {\
                                document.title = document.title_src;\
                                delete document.title_src;\
                            }\
                        }, 100);\
                    }\
                }\
            }\
            var '
          );
          arguments[Array.from(arguments).indexOf(moduleFun)] = parseFun(struct);
        } else if (moduleName === "douyu/page/room/normal/mod/gift/model/treasure" || moduleName === "douyu/page/room/webm/mod/gift/model/treasure") {
          struct = resolveFun(moduleFun);
          struct.codes = struct.codes.replace(
            /=1e3\*\(Math\.floor\(5\*Math\.random\(\)\)\+1\)/g,
            '= switchStates.RemoveBoxDelay ? 1e3 : 1e3*(Math.floor(5*Math.random())+1)'
          );
          arguments[Array.from(arguments).indexOf(moduleFun)] = parseFun(struct);
        } else if (moduleName === "douyu/page/room/normal/mod/freetime" || moduleName === "douyu/page/room/webm/mod/freetime") {
            struct = resolveFun(moduleFun);
            struct.codes = struct.codes.replace(
                'startListening:function(){',
                'startListening:function(){if (switchStates.ForbidTipCP) return;'
            );
            arguments[Array.from(arguments).indexOf(moduleFun)] = parseFun(struct);
        }
        /* else if (moduleName === "douyu/page/room/normal/mod/guess-game") {
            struct = resolveFun(moduleFun);
            struct.codes = struct.codes.replace(
                'case"rquizisn":',
                'case"rquizisn":console.log(t, i, i.isArray(s)?i.decode(s):[{value:s}]);'
            );
            arguments[Array.from(arguments).indexOf(moduleFun)] = parseFun(struct);
            console.log('hooked ============');
        } */
    } catch (err) {
        console.error('Hook failed', err);
    }

    return define_ORIGIN.apply(this, arguments);
}

function resolveFun(fun) {
    var funStr = fun.toString();
    var matchRes = funStr.match(/^function[\d\D]*?\(([\d\D]*?)\)[\d\D]*?{([\d\D]*)}/im);
    return {
        args: matchRes[1],
        codes: matchRes[2]
    };
}

function parseFun(struct) {
    return new Function(struct.args.split(','), struct.codes);
}