const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var openid = body.openid
    var nickName = body.nickName
    var avatarUrl = body.avatarUrl
    var gender = body.gender
    var result = await mysql("t_user").where("openid", openid).update({ nick_name: nickName, avatar_url: avatarUrl, gender: gender})
    ctx.state.data = result
}