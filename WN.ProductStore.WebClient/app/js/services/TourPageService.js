define(["app"
], function (app) {
    var deps = ['$timeout'];
    function TourPageService(timeout) {
        return {
            showTour:function(forceTour){
                var tour = new Tour({
                    name: "tour-conference",
                    debug: false,
                    container: "body",
                    storage: window.localStorage,
                    keyboard: false,
                    orphan: true,
                    backdrop: true,
                    backdropContainer: 'body',
                    backdropPadding: 0,
                    steps: [
                        {
                            // 1
                            title: " ",
                            container: "body",
                            template: "<div class='popover tour home-ad-div' style='width:260px;height:160px'>\
                                    <img src='./images/ad/note1.png'/>\
                                    <img style='margin-left:35%' class='home-ad-btn home-ad-next-btn' data-role='next'/>\
                                </div>",
                            content: ""
                        },
                        {
                            // 2
                            title: " ",
                            template: "<div class='popover tour home-ad-div' style='width:668px;height:267px'>\
                                    <img style='display:block' src='./images/ad/note2.png'/>\
                                    <img style='margin-left:35%' class='home-ad-btn home-ad-pre-btn' data-role='prev'/>\
                                    <img class='home-ad-btn home-ad-next-btn' data-role='next'/>\
                                </div>",
                            content: ""
                        },
                        {
                            // 3
                            title: " ",
                            template: "<div class='popover tour home-ad-div' style='display:block;width:675px;height:211px'>\
                                    <img class='tour' src='./images/ad/note3.png'/>\
                                    <img style='margin-left:35%' class='home-ad-btn home-ad-pre-btn' data-role='prev'/>\
                                    <img class='home-ad-btn home-ad-next-btn' data-role='next'/>\
                                </div>",
                            content: ""
                        },
                        {
                            // 4
                            title: " ",
                            template: "<div class='popover tour home-ad-div' style='width:443px;height:133px'>\
                                    <img src='./images/ad/note4.png'/>\
                                    <img style='margin-left:35%' class='home-ad-btn home-ad-pre-btn' data-role='prev'/>\
                                    <img class='home-ad-btn home-ad-next-btn' data-role='next'/>\
                                </div>",
                            content: ""
                        },
                        {
                            // 5
                            title: " ",
                            template: "<div class='popover tour home-ad-div' style='width:441px;height:128px'>\
                                    <img src='./images/ad/note5.png'/>\
                                    <img style='margin-left:35%' class='home-ad-btn home-ad-pre-btn' data-role='prev'/>\
                                    <img class='home-ad-btn home-ad-end-btn' data-role='end'/>\
                                </div>",
                            content: ""
                        },
                    ]
                });

                setTimeout(function(){
                    // Initialize the tour
                    tour.init(forceTour);
                    // Start the tour
                    tour.start(forceTour);
                },500);
            }
        };
    }

    TourPageService.$inject = deps;
    app.lazy.service("TourPageService", TourPageService);
});
