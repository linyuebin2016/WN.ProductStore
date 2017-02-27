/**
 * Created by chenweizhi2 on 2017/2/4.
 */
define(["app",
    "jquery",
    "jqueryWeUI",
    "md5",
    "ecb",
    "rsa",
    "jsbn",
    "rng",
    "prng4",
    "resources/UserResource",
    "services/SessionStorageService",
    "services/LocalStorageService",
    "services/UserService",
    "services/RsaService"
], function (app) {

    var deps = ['$scope', '$timeout', '$stateParams', '$state', '$rootScope', 'UserResource', 'SessionStorageService', 'LocalStorageService', 'UserService', 'RsaService'];

    var SAVE_PWD = "$@SAVE_PWD@$";

    var LOGINSTEP = {
        "INITPHONE": 1,
        "INITPASS": 2,
        "LOGIN": 3,
        "RESETPASS": 4,
        "RESETPHONE": 5
    }

    function controller($scope, $timeout, $stateParams, $state, $rootScope, UserResource, SessionStorageService, LocalStorageService, UserService, RsaService) {

        var loginStep = $stateParams.loginStep;
        $scope.loginStep = loginStep || LocalStorageService.getItem("login_step") || LOGINSTEP.INITPHONE;

        $scope.gotoStep = function gotoStep(step) {
            $scope.loginStep = step;
        }

        $scope.loginVo = {
            // userName:"",
            // password:"",
            // verifycode:"",
            // needLoginCode:false,//登录失败3，5次后启用验证码/app无需启用
            autoLogin: true,
            saveUser: true
        };

        $scope.loginVo.userName = LocalStorageService.getItem("last_login_user");
        $scope.loginVo.autoLogin = LocalStorageService.getItem('auto_login');

        $scope.$watch("loginVo.saveUser", function () {
            if (!$scope.loginVo.saveUser) {
                $scope.loginVo.autoLogin = false;
            }
        });
        $scope.$watch("loginVo.autoLogin", function () {
            if ($scope.loginVo.autoLogin) {
                $scope.loginVo.saveUser = true;
            }
        });

        $scope.verifycode = {
            title: "获取验证码",
            disable: false,
            second: 60
        };

        /* LOGIN */
        $scope.login = function () {
            if (!$scope.loginVo.userName || !phoneTest($scope.loginVo.userName)) {
                $.toast("请输入手机号码");
                return;
            }
            if (!passwordTest($scope.loginVo.password)) {
                $.toast("请录入密码");
                return;
            }

            var pwd = $scope.loginVo.password === SAVE_PWD ? LocalStorageService.getItem("last_login_pwd") : RsaService.secEncrypt($scope.loginVo.password);
            UserResource.login({
                userName: $scope.loginVo.userName,
                password: pwd,
                loginCode: $scope.loginVo.verifycode,//登录失败3，5次后启用验证码
                loginType: "1", // 强行登录
                deviceId: UserService.getDevice()
            }, function (user) {
                loginSuccessCB(user, pwd);
            }, function () {
                $scope.loginVo.autoLogin = false;
                $.toast("连接服务器失败");
            });
        }

        function loginSuccessCB(user, pwd) {
            if (user.authenticated) {
                $scope.loginVo.autoLogin = true;
                $scope.loginVo.saveUser = true;

                // user.userOrg && delete user['userOrg'] // 不保存在cookies
                // user.userOrgs && delete user['userOrgs'] // 不保存在cookies
                SessionStorageService.setItem("user", user);
                LocalStorageService.setItem("user", user);
                LocalStorageService.setItem("last_login_pwd", pwd);
                LocalStorageService.setItem("last_login_user", user.loginName);
                LocalStorageService.setItem("auto_login", $scope.loginVo.autoLogin);
                LocalStorageService.setItem("save_password", $scope.loginVo.saveUser);
                LocalStorageService.setItem("login_step", LOGINSTEP.LOGIN);

                $scope.currentUser = user;

                $state.go("home.task");
            } else {
                $scope.loginVo.autoLogin = false;
                $.toast(user.errorMessage);
                // $scope.loginVo.needLoginCode = user.needLoginCode;
                UserService.removeCurrentUser();
            }
        }

        // AUTO LOGIN
        if ($scope.loginStep == LOGINSTEP.LOGIN) {
            if (LocalStorageService.getItem("auto_login")) {
                $scope.loginVo.autoLogin = true;
            }
            if (LocalStorageService.getItem("save_password")) {
                $scope.loginVo.password = SAVE_PWD;
                $scope.loginVo.saveUser = true;
            } else {
                $scope.loginVo.saveUser = false;
            }
            if ($scope.loginVo.autoLogin) {
                $scope.login();
            }
        }

        /* INITPHONE */
        $scope.loginInitVo = {
            userName: "",
            verifycode: "",
            password: "",
            passwordConfim: ""
        };

        $scope.sendValidateCode = function () {
            // 获取验证码
            var mobile = (($scope.loginInitVo && $scope.loginInitVo.userName) || ($scope.resetVo && ($scope.resetVo.userName || $scope.resetVo.userNameOld)));
            if (!mobile) {
                $.toast("请输入手机号码");
                return;
            }
            if (!phoneTest(mobile)) {
                $.toast("手机号码输入错误");
                return;
            }

            // 发送验证码
            UserResource.sendValidateCode({
                mobile: mobile
            }, function (result) {
                if (result.status == 1) {
                    $scope.verifycode.disable = true;
                    for (var i = 0; i <= $scope.verifycode.second; i++) {
                        (function (x) {
                            $timeout(function () {
                                $scope.verifycode.title = ($scope.verifycode.second - x) + "s";
                                if (x === $scope.verifycode.second) {
                                    $scope.verifycode.title = "再次获取验证码";
                                    $scope.verifycode.disable = false;
                                }
                            }, 1000 * x)
                        })(i);
                    }
                } else {
                    $.toast(result.errorMsg);
                }
            });
        }

        $scope.checkValidateCode = function () {
            // 验证手机&验证码
            if (!phoneTest($scope.loginInitVo.userName)) {
                $.toast("手机号码输入错误");
                return;
            }
            if (!$scope.loginInitVo.verifycode) {
                $.toast("验证码为空");
                return;
            }
            UserResource.checkValidateCode({
                mobile: $scope.loginInitVo.userName,
                validateCode: $scope.loginInitVo.verifycode
            }, function (result) {
                if (result.status === 1) {
                    $scope.loginStep = LOGINSTEP.INITPASS;
                } else {
                    $.toast(result.errorMsg);
                }
            }, function onerror() {
                $.toast("连接服务器失败");
            });
        }

        /* INITPASS */
        $scope.initPassword = function () {
            // 设置密码
            if (!$scope.loginInitVo.password) {
                $.toast("请输入密码");
                return;
            }
            if (!passwordTest($scope.loginInitVo.password)) {
                $.toast("密码长度至少6位");
                return;
            }
            if ($scope.loginInitVo.passwordConfim != $scope.loginInitVo.password) {
                $.toast("两次输入密码不相同");
                return;
            }
            var pwd = RsaService.secEncrypt($scope.loginInitVo.password);
            UserResource.initPassword({
                mobile: $scope.loginInitVo.userName,
                password: pwd
            }, function (user) {
                loginSuccessCB(user, pwd);
            }, function () {
                $scope.loginVo.autoLogin = false;
                $.toast("连接服务器失败");
            })
        }

        /* RESETPASS */
        $scope.resetVo = {
            // userName: "",
            // password: "",
            // confimPassword: "",
            // verifycode: "",
            // userNameOld: "",
            // userNameNew: ""
        };
        $scope.resetPassword = function () {
            if (!phoneTest($scope.resetVo.userName)) {
                $.toast("手机号码有误");
                return;
            } else if (!$scope.resetVo.verifycode) {
                $.toast("请输入验证码");
                return;
            } else if (!passwordTest($scope.resetVo.password)) {
                $.toast("密码长度至少6位");
                return;
            } else if ($scope.resetVo.password != $scope.resetVo.confimPassword) {
                $.toast("两次密码输入不同");
                return;
            } else {
                UserResource.resetPassword({
                    mobile: $scope.resetVo.userName,
                    password: RsaService.secEncrypt($scope.resetVo.password),
                    validateCode: $scope.resetVo.verifycode
                }, function onsuccess(result) {
                    if (result.authenticated) {
                        $.toast("修改密码成功");
                        $timeout(function () {
                            $scope.resetVo = {};
                            $scope.loginStep = LOGINSTEP.LOGIN;
                        }, 2000)
                    } else {
                        $.toast(result.errorMsg);
                    }
                }, function onerror() {
                    $.toast("连接服务器失败");
                })
            }
        }

        /* RESETPHONE */
        $scope.resetPhone = function () {
            if ($scope.resetVo.userNameOld === $scope.resetVo.userNameNew) {
                $.toast("两次手机号码相同");
                return;
            } else if (!$scope.resetVo.verifycode) {
                $.toast("请输入验证码");
                return;
            } else {
                $.confirm("请您确认新的手机号码是:" + $scope.resetVo.userNameNew + "<br>如果错误，只能通过线下联系市委专责修改。", "提示", function () {
                    UserResource.resetUserMobile({
                        mobile: $scope.resetVo.userNameOld,
                        umobile: $scope.resetVo.userNameNew,
                        validateCode: $scope.resetVo.verifycode
                    }, function onsuccess(result) {
                        if (result.status == 1) {
                            $.toast("修改手机成功");
                            $timeout(function () {
                                $scope.resetVo = {};
                                $scope.loginStep = LOGINSTEP.LOGIN;
                            }, 2000)
                        } else {
                            $.toast(result.errorMsg);
                        }
                    }, function onerror() {
                        $.toast("连接服务器失败");
                    })
                }, function () {
                    //取消操作
                });
            }
        }
    }

    function phoneTest(phone) {
        return phone && /^1[0-9]{10}$/.test(phone);
    }

    function passwordTest(password) {
        if (!password || password.length < 6) {
            return false;
        }
        return true;
    }

    controller.$inject = deps;
    app.lazy.controller("LoginController", controller);
});