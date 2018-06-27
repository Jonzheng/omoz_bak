const { mysql } = require('../qcloud')
const Conf = require('../config')
const request = require('request');

module.exports = async ctx => {
    var body = ctx.request.body
    var js_code = body.js_code
    var url = Conf.loginApi + js_code
    //console.log(url)
    var openid = ''

    function getOpenid() {
        return new Promise((resolve, reject) => {
            request(url, function (error, response, body) {
                //console.log(body)
                var jsonData = JSON.parse(body)
                openid = jsonData.openid
                resolve()
            })
        })
    }
    await getOpenid()
    //console.log(openid)

    await mysql.raw('insert into t_user(openid, c_date) values (?,now())on duplicate key update latest_date = now()', openid);

    var avatarUrl = body.avatarUrl
    if (avatarUrl) await mysql("t_user").where("openid", openid).update({ avatar_url: avatarUrl })
    ctx.state.data = openid
}