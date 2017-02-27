define(["app",
    "lodash",
    'services/MessageBox',
    'services/BaseService',
    'services/TipsService'
], function(app, _) {

    var deps = ['TipsService', 'MessageBox', '$cacheFactory', 'BaseService'];

    function CacheService(TipsService, MessageBox, $cacheFactory, BaseService) {

        var _cacheConversation = true;

        var queryConversationCache = window.sessionStorage; // 使用本地缓存

        function isRetract(dialogueVo) {
            if (dialogueVo.dialogueInfo.indexOf('撤回了一条消息') > -1) {
                return true;
            }
            return false;
        }

        function retractConversation(conversationVo, dialogueVo) {
            // 缓存撤回消息
            var index = _.findIndex(conversationVo.dialogues, function(dialogue) {
                return dialogue.topicItemId == dialogueVo.topicItemId;
            })
            if (index != -1) {
                conversationVo.dialogues.splice(index, 1);
                queryConversationCache.setItem(conversationVo.topicId, JSON.stringify(conversationVo));
            }
        }

        function deleteDialogueVo(dialogueVo) {
            var conversationVo = getOriginConversationVo(dialogueVo.topicId);
            if (conversationVo != null) {
                var index = _.findIndex(conversationVo.dialogues, function(dialogue) {
                    return dialogue.topicItemId == dialogueVo.topicItemId;
                })
                if (index != -1) {
                    conversationVo.dialogues.splice(index, 1);
                    queryConversationCache.setItem(dialogueVo.topicId, JSON.stringify(conversationVo));
                }
            }
        }

        function pushDialogueVo(dialogueVo) {
            var conversationVo = getOriginConversationVo(dialogueVo.topicId);
            if (conversationVo != null) {
                if (isRetract(dialogueVo)) {
                    retractConversation(conversationVo, dialogueVo);
                } else {
                    var index = _.findIndex(conversationVo.dialogues, function(dialogue) {
                        return dialogue.topicItemId == dialogueVo.topicItemId;
                    })
                    if (index == -1) {
                        conversationVo.dialogues.push(dialogueVo);
                        queryConversationCache.setItem(dialogueVo.topicId, JSON.stringify(conversationVo));
                    }
                }
            }
        }

        function pushConversationVo(conversationVo) {
            if (!queryConversationCache.getItem(conversationVo.topicId)) {
                queryConversationCache.setItem(conversationVo.topicId, JSON.stringify(conversationVo));
            } else {
                var OriginConversationVo = getOriginConversationVo(conversationVo.topicId);
                if (OriginConversationVo != null) {
                    var dialogueLength = conversationVo.dialogues.length;
                    for (var i = dialogueLength - 1; i >= 0; i--) {
                        var dialogueVo = conversationVo.dialogues[i];
                        var index = _.findIndex(OriginConversationVo.dialogues, function(dialogue) {
                            return dialogue.topicItemId == dialogueVo.topicItemId;
                        })
                        if (index == -1) {
                            OriginConversationVo.dialogues.unshift(dialogueVo);
                        }
                    }
                    queryConversationCache.setItem(OriginConversationVo.topicId, JSON.stringify(OriginConversationVo));
                }
            }
        }

        function getOriginConversationVo(topicId){
            var conversationVo = null;
            var tmp = queryConversationCache.getItem(topicId);
            if (tmp) {
                conversationVo = JSON.parse(tmp);
            }
            return conversationVo;
        }

        function getConversationVo(topicId, size) {
            var conversationVo = getOriginConversationVo(topicId);
            if (conversationVo != null) {
                if (conversationVo && conversationVo.dialogues && conversationVo.dialogues.length >= size) {
                    conversationVo.dialogues.splice(0, conversationVo.dialogues.length - size);
                } else {
                    queryConversationCache.removeItem(topicId);
                    conversationVo = null;
                }
            }
            return conversationVo;
        }

        function getConversationVoByTimeStrap(topicId, size, timeStamp) {
            var conversationVo = getOriginConversationVo(topicId);
            if (conversationVo != null) {
                if (conversationVo && conversationVo.dialogues && conversationVo.dialogues.length >= size) {
                    var index = _.findIndex(conversationVo.dialogues, function(dialogue) {
                        return dialogue.createDate == timeStamp;
                    })
                    if (index >= size) {
                        conversationVo.dialogues.splice(index);
                        conversationVo.dialogues.splice(0, conversationVo.dialogues.length - size);
                    } else {
                        conversationVo = null
                    }
                } else {
                    conversationVo = null;
                }
            }
            return conversationVo;
        }

        return {
            includeConversationCache: function(topicId) {
                return queryConversationCache.getItem(topicId) != null;
            },
            getConversationCache: function(topicId, size, timeStamp) {
                if (!timeStamp) {
                    return getConversationVo(topicId, size);
                } else {
                    return getConversationVoByTimeStrap(topicId, size, timeStamp);
                }

            },
            pushConversationCache: function(infoVo) {
                if (infoVo.topicItemId != null || infoVo.sendType == 1) {
                    pushDialogueVo(infoVo);
                } else if (infoVo.dialogues != null) {
                    pushConversationVo(infoVo);
                }
            },
            deleteConversationCache: function(dialogueVo) {
                deleteDialogueVo(dialogueVo);
            },
            clearConversationCache: function() {
                queryConversationCache.clear();
            }
        };
    }

    CacheService.$inject = deps;
    app.lazy.service("CacheService", CacheService);
});
