/**
 * Created by xiangshang on 2017-11-20
 */
define(["app"
], function (app) {

    var deps = ["$rootScope"];

    function showAudio(path){
        try {
            var audio = document.createElement('audio');
            audio.src = path;
            audio.loop = false;
            audio.play();
        } catch (ex) {
            console.log(ex);
        }
    }

    function AudioService($rootScope) {
        return {
            showCoinAudio: function(){
                showAudio('audio/coin.mp3');
            }
        };
    }

    AudioService.$inject = deps;
    app.lazy.service("AudioService", AudioService);
});
