const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var result = ""
    let body = ctx.request.body
    var record_id = body.record_id
    var user_id = body.user_id
    var file_id = body.file_id
    var master_id = body.master_id
    console.log(record_id,user_id)
    result = await mysql.raw('insert t_heart (record_id,user_id,file_id,master_id) values(?,?,?,?)on duplicate key update status = 1', [record_id, user_id, file_id, master_id]);
    result = await mysql.raw('update t_record set heart = heart+1 where record_id = ?', record_id);
    ctx.state.data = result
}