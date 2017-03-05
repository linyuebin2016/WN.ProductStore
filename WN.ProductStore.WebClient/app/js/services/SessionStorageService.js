define(['app'],
    function (app) {

        var deps = [];

        var storage = window.sessionStorage; // 使用session缓存

        function service() {
            return {
                setItem: function (key, value) {
                    if (typeof value === "object") {
                        value = JSON.stringify(value);
                    }
                    storage.setItem(key, value);
                    return storage.getItem(key);
                },
                getItem: function (key) {
                    var temp = storage.getItem(key);
                    if (temp === 'true') {
                        return true;
                    } else if (temp === 'false') {
                        return false;
                    }
                    if (temp && (temp.substring(0, 1) === "{" || temp.substring(0, 1) === "[")) {
                        return JSON.parse(temp)
                    }
                    return temp;
                },
                removeItem: function (key) {
                    var temp = storage.getItem(key);
                    if (temp != null) {
                        storage.removeItem(key);
                    }
                },
                clear: function () {
                    storage.clear();
                }
            };
        }

        service.$inject = deps;
        app.lazy.service("SessionStorageService", service);
    });
