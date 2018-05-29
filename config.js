/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://06mdkod2.qcloud.la';

var appId = 'wx2ce3e7794b9393b8';
var appSecret = '258ce2e03d8dd6f330d6d6f3423411da';

var Conf = {
    host,
    qAudioUrl: `${host}/weapp/qAudio`,
    qListUrl: `${host}/weapp/qList`,
    inListUrl: `${host}/weapp/inList`,
    upVideoUrl: `${host}/weapp/upVideo`,
    upAudioUrl: `${host}/weapp/upAudio`,
    upRecordUrl: `${host}/weapp/upRecord`,
    updLoginUrl: `${host}/weapp/updLogin`,
    loginApi: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&grant_type=authorization_code&js_code=`
};

module.exports = Conf;
