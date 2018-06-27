const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var result = ""
    let body = ctx.request.body
    var record_id = body.record_id
    var user_id = body.user_id
    var file_id = body.file_id
    var master_id = body.master_id
    result = await mysql.raw('update t_heart set status = 0 where record_id = ? and user_id = ?', [record_id, user_id]);
    result = await mysql.raw('update t_record set heart = heart-1 where record_id = ?', record_id);
    ctx.state.data = result
}