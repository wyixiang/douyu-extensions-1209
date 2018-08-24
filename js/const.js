var ONE_DAY_MS = 86400000;

var MSG_TYPE = {
    UpdateSwitch: 1,
    UpdateSwitchAll: 2,
    InitData: 3,
    ContentForwardBack: 4,
    UpdateConfig: 5,
    UpdateConfigAll: 6,
    Notify: 7,
    AudioTip: 8,
    GotBox: 9,
    Refresh: 10
};

var Switch = {
    AdBlock: { CN: "屏蔽广告", index: 0, tip: "屏蔽网页的广告\n屏蔽斗鱼播放器的广告" },
    ForbidAutoJump: { CN: "禁止直播结束自动跳转", index: 1, tip: "开启后, 斗鱼直播结束后将不会再自动跳转到其他直播间" },
    ForbidTipCP: { CN: "直播时不弹出继续观看", index: 2, tip: "斗鱼每隔40分钟无页面操作时会弹出是否继续观看的倒计时\n开启后, 将不再弹出" },
    LiveTip: { CN: "开播提醒 - 点击设置", index: 3, tip: "开启后, 在列表内的主播开播时将会提醒\n点击开播提示可直接进入直播间\n(无需打开页面, 后台监听是否开播)", config: true },
    AutoGetGift: { CN: "自动领取礼物箱子", index: 4, tip: "开启后, 在箱子可领取时, 将会自动点击\n(如果弹出验证码, 需用户手动验证)" },
    RemoveBoxDelay: { CN: "移除箱子延迟", index: 5, tip: "斗鱼的箱子会随机附加加载延迟\n开启后, 该延迟将被强制设置为0" },
    AutoGiveGift: { CN: "允许批量赠送礼物", index: 6, tip: "开启后, 礼物界面增加自定义数量赠送窗口\n每次更改刷新网页后启用"},
    ChatController: { CN: "启用聊天室控制台", index: 7, tip: "开启后, 直播间聊天室将新增一个图标\n鼠标移致该图标上方将可展开一些聊天室的扩展功能\n不启用控制台会使控制台相关的功能都自动禁用" },
    GetBoxHelp: { CN: "开宝箱辅助", index: 8, tip: "开启后, 将出现当日的宝箱计数，斗鱼每日领取上限为100个\n有新的箱子需要验证, 发出提示音, 并且该页面标题将提示", config: true },

    ChatAt: { CN: "开启AT功能", index: 100, type: 'chat', tip: "开启后任意人都可以AT你 (你在聊天室才可收到), @Name即可AT别人(插件使用者)\n同时用户信息面板将增加一个按钮'@此人', 点击后会在聊天框自动输入" },
    OnlyAdminAt: { CN: "仅允许管理员AT我", index: 101, type: 'chat', tip: "管理员指主播/房管/超管" },
    ForceMute: { CN: "强制禁言", index: 102, type: 'chat', tip: "用户信息面板增加一个强制禁言的按钮, 该选项可以封禁广告\n实现方式为调用后台的禁言接口\n该功能的禁言成功提示其他用户不可见" },
    AutoMute: { CN: "自动强制禁言", index: 103, type: 'chat', tip: "自动对符合禁言规则的用户进行封禁" },
    PreventWrong: { CN: "防误封", index: 104, type: 'chat', tip: "开启后, 自动禁言在以下条件符合时将跳过封禁检查\n1.发言内容长度 ≤ 8\n2.佩戴本直播间粉丝牌且粉丝牌等级 ≥ 2" },
    // 不自动清屏
    ChatMode: { CN: "完全聊天模式", index: 106, type: 'chat', tip: "聊天室中聊天之外的内容将被隐藏\n如用户前缀(用户角色标记除外, 如主播), 进房信息等" },
    ChatMode2: { CN: "普通聊天模式", index: 107, type: 'chat', tip: "隐藏一些聊天不相关的内容" },
    HideChat: { CN: "隐藏聊天", index: 108, type: 'chat', tip: "聊天室内容将被隐藏\n可在网页过于卡顿时开启此功能" },
    PreventLag: { CN: "防卡模式", index: 109, type: 'chat', tip: "用于在弹幕量/礼物量过多时开启, 可有效防止网页卡顿\n但会导致一些斗鱼网页功能失效 (直播和飘屏弹幕不受影响)\n该功能开启后仅在当前网页生效, 不会保存设置" }
};

var defaultSwitchStates = {
    AdBlock: true,
    ForbidAutoJump: true,
    ForbidTipCP: true,
    AutoGetGift: true,
    RemoveBoxDelay: true,
    AutoGiveGift: true,
    ChatController: true,
    GetBoxHelp: true
};

var SoundList = ["ding.wav", "biu.wav", "干杯.mp3", "baka.mp3", "卟卟.mp3", "短信.mp3", "rua.mp3"];

var defaultConfig = {
    liveTipList: [],
    extAdmin: ["纳豆nado"],
    boxLog: { count: 0, date: '' },
    soundIndex: 0,
    soundVolume: 10,
    rules: [{ key: 'Q群', lv: 4, day: 30 }, { key: '扣群', lv: 4, day: 30 }, { key: '模特', lv: 4, day: 30 }, { key: '凌辱', lv: 4, day: 30 }, { key: '白浆', lv: 4, day: 30 }, { key: '嫩学生', lv: 4, day: 30 }, { key: '喷液', lv: 4, day: 30 }, { key: 'regex:嫩.?妹', lv: 4, day: 30 }, { key: '咑萢', lv: 4, day: 30 }, { key: '威信', lv: 4, day: 30 }, { key: '薇信', lv: 4, day: 30 }, { key: '相册', lv: 4, day: 30 }, { key: '高能电影房间', lv: 4, day: 30 }, { key: '射液', lv: 4, day: 30 }, { key: 'regex:性.?感.?白.?领', lv: 4, day: 30 }, { key: 'regex:初.中.生', lv: 4, day: 30 }, { key: '巨乳人妻', lv: 4, day: 30 }, { key: '被插操', lv: 4, day: 30 }, { key: '操冯', lv: 4, day: 30 }, { key: '淫射', lv: 4, day: 30 }, { key: '粉穴', lv: 4, day: 30 }, { key: '轮插', lv: 4, day: 30 }, { key: '喷嘴', lv: 4, day: 30 }, { key: '放尿', lv: 4, day: 30 }, { key: '乳穴', lv: 4, day: 30 }, { key: '射穴', lv: 4, day: 30 }, { key: '操B', lv: 4, day: 30 }]
};

var PACK_TYPE = {
    LoginRes: "loginres", // 登录响应
    KeepLive: "keeplive", // 心跳包
    Chat: "chatmsg", // 弹幕
    Gift: "dgb", // 礼物
    OnlineNobleList: "online_noble_list", // 在线贵族列表
    UserEnter: "uenter", // 用户进入直播间
    Deserve: "bc_buy_deserve", // 酬勤礼物
    GiftBC: "spbc", // 高级礼物广播
    GetGift: "gpbc", // 领取礼物 (开宝箱)
    RoomExp: "synexp", // 直播间等级信息
    Upgrade: "upgrade", // 升级
    SignUpgrade: "blab", // 牌子升级
    FansRank: "frank", // 粉丝团信息
    StarRank: "rlcn", // 巨星榜
    StarListInfo: "qausrespond", // 巨星榜 领先 & 落后 详情
    StarRankChange: "rri", // 巨星榜变化
    RankList: "ranklist", // 排行榜
    RankUp: "rankup", // 排行榜变化
    NewNoble: "rnewbc", // 开通贵族广播
    GetGiftCrit: "onlinegift", // 领取鱼丸暴击
    NewBlackList: "newblackres", // 黑名单加人
    SharkRoom: "srres", // 分享直播间
    SharkRoom2: "sssrres", // 分享直播间
    RoomState: "rss", // 直播间状态更新
    Rquiziln: "rquiziln", // 竞猜
    Rquizisn: "Rquizisn" // 竞猜2
    // cthn, anbc
};

window.constInitialized = true;