var _appId = 'wx2ce3e7794b9393b8';
var _appSecret = '258ce2e03d8dd6f330d6d6f3423411da';

const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx2ce3e7794b9393b8',

    // 微信小程序 App Secret
    appSecret: '258ce2e03d8dd6f330d6d6f3423411da',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    loginApi: `https://api.weixin.qq.com/sns/jscode2session?appid=${_appId}&secret=${_appSecret}&grant_type=authorization_code&js_code=`,
    
    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '',
        port: 3306,
        user: 'root',
        db: 'omoz',
        pass: 'omoz.2333',
        char: 'utf8mb4'
    },
    //不用原有的封装了
    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         * https://test-1256378396.cos.ap-guangzhou.myqcloud.com/upload/1523368207642-HkdzWr5sG.png
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'omoz',
        // 文件夹
        uploadFolder: 'upload'
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
