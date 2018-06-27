const { mysql } = require('../qcloud')

module.exports = async ctx => {
    var data = {}
    var body = ctx.request.body
    var file_id = body.file_id
    if (file_id != undefined){
        data = await mysql('t_list').select('*').where('cate', body.cate).andWhere('file_id', file_id)
    }else{
        data = await mysql('t_list').select('*').where('cate', body.cate)
    }
    ctx.state.data = data
}