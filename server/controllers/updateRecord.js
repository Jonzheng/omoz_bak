const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var record_id = body.record_id
    var status = body.status
    result = await mysql("t_record").where("record_id", record_id).update({ status: status})
    ctx.state.data = result
}