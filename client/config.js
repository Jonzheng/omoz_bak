/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://06mdkod2.qcloud.la';
//var host = 'https://418980938.omoz.club';

var appId = 'wx2ce3e7794b9393b8';
var appSecret = '258ce2e03d8dd6f330d6d6f3423411da';

var Conf = {
    host,
    qAudioUrl: `${host}/weapp/qAudio`,
    qListUrl: `${host}/weapp/qList`,
    queryDetailUrl: `${host}/weapp/queryDetail`,
    inListUrl: `${host}/weapp/inList`,
    upVideoUrl: `${host}/weapp/upVideo`,
    upAudioUrl: `${host}/weapp/upAudio`,
    uploadRecordUrl: `${host}/weapp/uploadRecord`,
    updateLoginUrl: `${host}/weapp/updateLogin`,
    updateUserUrl: `${host}/weapp/updateUser`,
    updateRecordUrl: `${host}/weapp/updateRecord`,
    updateHeartUrl: `${host}/weapp/updateHeart`,
    cancelHeartUrl: `${host}/weapp/cancelHeart`,
};

module.exports = Conf;
