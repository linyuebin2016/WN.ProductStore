/**菜单的配置信息**/
define(["app"], function(app) {
    /**
     * RSA非对称加密.
     */
    function secEncrypt(value) {
        /**
         * 加密公钥.
         */
        var pk = {
                n:"55ad4b6c739452c01710d7763455abca358fc472a243517e743ef1d69618b6396fe7a76409cef96b716cb73723235f56614e19ee16bd0e0a8f47b8639ef15b6a95124e984757133060114472ef20ff18087cef05647d02ed70c3e7a9afb1ed0023cedcf64f9eea0d8ae0be7d68938f5c413077978d5435621f2c52524dbf8a97",
                e: "10101"
            };
        var rsa = new RSAKey();
        rsa.setPublic(pk.n, pk.e);
        return rsa.encrypt(value);
    };

    app.lazy.service("RsaService", function() {
        return {
            secEncrypt: function(value){
                return secEncrypt(value)
            }
        }
    });
});
