/**
 * Created by qiushaohua on 15-2-4.
 */
define(['app', 'lodash'], function(app, _) {

    'use strict';

    var deps = ["BaseService"];

    function service(BaseService) {

        function getEmotionImg(config, name) {
            if (typeof config === 'string') {
                config = EMOTIONS[config];
            }
            if (config.type == 5) {
                var picId = config.emotionInfo[name];
                return BaseService.restfulUrl + 'userimage/getImage/' + picId + '?picType=2';
            }
            if (/^\d+/.test(name)) {
                if (config.emotionType !== "qq") { // qq类型是序号同时也是名字
                    var tmp = config.emotions[name];
                    if (tmp) { // 如果纯数字即可能是名字也可能是序号
                        name = tmp
                    }
                }
            } else if (name === REVERSE_REG_STR) {
                name = '(\\d+)'; // 在reverse中构造正则匹配路径
            } else if (name.split("-")[1]) { // 分组新样式 qq-27
                name = name.split("-")[1];
            } else if (/[^\d\\u4e00-\\u9fa5]{1,}/.test(name)) { // 汗2
                var index = _.findIndex(config.names, function(configname) {
                    return configname === name;
                });
                if (index > -1) {
                    name = config.emotions[index];
                }
            }
            return IMAGE_PATH + config.prefix + "/" + config.emotionType + '-' + name + config.suffix;
        }

        return {
            getConfig: function getConfig(type) {
                return EMOTIONS[type];
            },
            getEmotionImg: getEmotionImg,
            getEmotionType: getEmotionType,
            resolve: function resolve(html, option) {
                var type = option ? option.emotionType : null;
                if (!runInBrowser()) {
                    html = html.replace(EMOTION_REG, function() {
                        var name = arguments[1];
                        var config;
                        if (type) {
                            config = BIG_EMOTION_MAPS[type];
                        } else if (/^\d+/.test(name)) {
                            config = EMOTION_MAPS[name];
                        } else if (name.split("-")[0]) {
                            config = EMOTIONS[getType(name.split("-")[0])]
                        }
                        if (!config) { // 旧版匹配
                            for (var configName in EMOTIONS) {
                                if (_.indexOf(EMOTIONS[configName].names, name) > -1) {
                                    config = EMOTIONS[configName];
                                    break;
                                }
                            }
                            if (!config) { // 没有这个表情, 忽略;
                                return arguments[0];
                            }
                        }
                        var ondragstart = "";
                        if (config.emotionType != 'qq') {
                            var ondragstart = "ondragstart='return false'"
                        }
                        return '<img ng-cancel-drag src="' + getEmotionImg(config, name) + '" ' + ondragstart + '>';
                    });
                } else {
                    html = html.replace(EMOTION_REG, function() {
                        var name = arguments[1];
                        return '<img ng-cancel-drag src="images/emoticons/qq/' + name + '.png">';
                    });
                }
                return html;
            },
            reverse: function reverse(config, text) {
                if (typeof config === 'string') {
                    config = EMOTIONS[config];
                }
                if (!config.reverseRegex) {
                    var regStr = getEmotionImg(config, REVERSE_REG_STR);
                    regStr = '<img[^>]*?src="(http.*?/)?' + regStr + '"[^>]*?>';
                    config.reverseRegex = new RegExp(regStr, 'g');
                }
                return text.replace(config.reverseRegex, '[' + config.prefix + '-$2]');
            },
            addCollection: function addCollection(name) {
                EMOTIONS['collection'].emotions.push(name.emotionName);
                EMOTIONS['collection'].emotionInfo.push(name.emotionInfo);
                EMOTIONS['collection'].total++;
                return EMOTIONS['collection'];
            },
            removeCollection: function addCollection(index) {
                EMOTIONS['collection'].emotions.splice(index, 1);
                EMOTIONS['collection'].emotionInfo.splice(index, 1);
                EMOTIONS['collection'].total--;
                return EMOTIONS['collection'];
            },
            setCollection: function setCollection(emotion) {
                EMOTIONS['collection'] = emotion;
            }
        };
    }

    var IMAGE_PATH = 'images/emoticons/';

    // \w+ 类型名，新样式是这样格式 type
    // \d+ 多个数字
    // [\u4e00-\u9fa5]+\d?  汉字, 后面带一个可选的数字
    // [a-z ]{4,} 4 位以上的字母或空格
    var EMOTION_REG = /\[(\w+\-\d+|\d+|[\u4e00-\u9fa5]+\d?|[a-z ]{4,})\]/g;

    // 分组短名2个以上字母
    var REVERSE_REG_STR = '([a-z]{2,}\-\d+|\\d+|[\\u4e00-\\u9fa5]{2,}|[a-z ]{4,})';

    var ImageRex = /\[[a-z0-9]{24}]/g;

    /** 判断该内容是否为表情 **/
    function getEmotionType(html) {
        if (ImageRex.test(html) || /^[a-z]*|[A-Z]*$/.test(html) || /^[0-9]*$/.test(html) || /^[\u4e00-\u9fa5]*$/.test(html)) {
            return 0; // 如果没有表情样式文本
        }
        var emotionType = html.replace(EMOTION_REG, function() {
            var name = arguments[1];
            var config;
            if (name.indexOf('-') > -1 && name.split("-")[0]) {
                return EMOTIONS[getType(name.split("-")[0])].emotionType;
            } else if (/^\d+/.test(name)) {
                return EMOTION_MAPS[name].emotionType;
            } else { //旧版本匹配名字匹配
                for (var config in EMOTIONS) {
                    if (_.indexOf(EMOTIONS[config].names, name) > -1) {
                        return EMOTIONS[config].emotionType;
                    }
                }
            }
        });

        return emotionType
    }

    // 新增一种类型配置短命匹配和 EMOTIONS 及对应png文件
    function getType(shortName) {
        if (shortName === "qq") return "normal";
        if (shortName === "mdd") return "mengdoudou";
        if (shortName === "ele") return "elephant";
        if (shortName === "chang") return "changchang";
    }

    var EMOTIONS = {
        collection: {
            type: 5, // MNE
            emotions: [],
            emotionInfo: [],
            total: 0,
            rowsPerPage: 2,
            columnsPerRow: 4,
            className: 'fc-emotion-icon-elephant',
            style: {
                'height': 60
            },
            showName: true,
            publish: true
        },
        mengdoudou: {
            type: 4, // MNE
            emotions: makeNumericEmotionIndex('mdd/'),
            names: makeNumericEmotionName('mdd/'),
            total: getEmotionsJson('mdd/').emoticons.length,
            emotionType: getEmotionsJson('mdd/').type,
            rowsPerPage: 2,
            columnsPerRow: 4,
            prefix: 'mdd',
            suffix: '.gif',
            className: 'fc-emotion-icon-elephant',
            style: {
                'height': 93
            },
            showName: true,
            publish: true
        },
        elephant: {
            type: 3, // 新版本用 前缀得知类型
            emotions: makeNumericEmotionIndex('ele/'),
            names: makeNumericEmotionName('ele/'),
            total: getEmotionsJson('ele/').emoticons.length,
            emotionType: getEmotionsJson('ele/').type,
            rowsPerPage: 2,
            columnsPerRow: 4,
            prefix: 'ele',
            suffix: '.png',
            className: 'fc-emotion-icon-elephant',
            showName: true,
            publish: true
        },
        changchang: {
            type: 2,
            emotions: makeNumericEmotionIndex('chang/'),
            names: makeNumericEmotionName('chang/'),
            total: getEmotionsJson('chang/').emoticons.length,
            emotionType: getEmotionsJson('chang/').type,
            rowsPerPage: 2,
            columnsPerRow: 4,
            prefix: 'chang',
            suffix: '.gif',
            className: 'fc-emotion-icon-elephant',
            showName: true,
            publish: true
        },
        normal: {
            type: 1, // 经典
            emotions: makeNumericEmotionIndex('qq/'),
            names: makeNumericEmotionName('qq/'),
            total: getEmotionsJson('qq/').emoticons.length,
            emotionType: getEmotionsJson('qq/').type,
            rowsPerPage: 5,
            columnsPerRow: 12,
            prefix: 'qq',
            suffix: '.png',
            className: 'fc-emotion-icon-normal'
        },
        normalbrowser: {
            type: 1, // 经典
            emotions: BrowserFakeEmotionInfo(),
            names: BrowserFakeEmotionInfo(),
            total: 105,
            emotionType: 'qq',
            rowsPerPage: 5,
            columnsPerRow: 12,
            prefix: 'qq',
            suffix: '.png',
            className: 'fc-emotion-icon-normal'
        }
    };

    function BrowserFakeEmotionInfo() {
        var arr = []
        for (var i = 0; i < 105; i++) {
            arr.push(i);
        }
        return i
    }

    function getEmotionsJson(base) {
        var json = {};
        runInBrowser(function() {
            json = require('../resource/images/emoticons/' + base + 'emoticons.json');
        }, function() {
            json.emoticons = []
        })
        return json;
    }

    function makeNumericEmotionIndex(base) {
        var json = getEmotionsJson(base);
        var arr = [];
        for (var i = 0; i < json.emoticons.length; i++) {
            arr.push(json.emoticons[i].index);
        }
        return arr;
    }

    function makeNumericEmotionName(base) {
        var json = getEmotionsJson(base);
        var arr = [];
        for (var i = 0; i < json.emoticons.length; i++) {
            arr.push(json.emoticons[i].name);
        }
        return arr;
    }

    function updateEmotionConfig() {
        for (var name in EMOTIONS) {
            if (EMOTIONS.hasOwnProperty(name)) {
                EMOTIONS[name].name = name;
            }
        }
    }
    updateEmotionConfig();

    function reverseEmotionConfig() {
        var map = {};
        for (var name in EMOTIONS) {
            if (EMOTIONS.hasOwnProperty(name) && !EMOTIONS[name].publish) {
                var emotions = EMOTIONS[name].emotions;
                for (var i = 0, len = emotions.length; i < len; i++) {
                    var emotion = emotions[i];
                    map[emotion] = EMOTIONS[name];
                }
            }
        }
        return map;
    }
    var EMOTION_MAPS = reverseEmotionConfig();

    /**
     * 大表情, 配置了publish: true 的那些表情, 点了之后直接上屏的那种.
     * 这个有可能出现重名, 所以根据类型来进行处理先, 也加上才行了.
     */
    function reverseBigEmotionConfig() {
        var map = {};
        for (var name in EMOTIONS) {
            if (EMOTIONS.hasOwnProperty(name) && EMOTIONS[name].publish) {
                var type = EMOTIONS[name].type;
                map[type] = EMOTIONS[name];
            }
        }
        return map;
    }
    var BIG_EMOTION_MAPS = reverseBigEmotionConfig();

    service.$inject = deps;
    app.lazy.service('EmotionService', service);
});
