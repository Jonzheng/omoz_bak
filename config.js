/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://06mdkod2.qcloud.la';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        qAudioUrl: `${host}/weapp/qAudio`,
        qListUrl: `${host}/weapp/qList`,
        inListUrl: `${host}/weapp/inList`,
        upVideoUrl: `${host}/weapp/upVideo`,
        upAudioUrl: `${host}/weapp/upAudio`
    }
};

module.exports = config;
