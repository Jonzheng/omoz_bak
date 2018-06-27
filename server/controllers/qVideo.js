const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var data = ""
    if (body.file_id){
        data = await mysql('t_video').select('*').where('file_id', body.file_id)
    } else{
        data = await mysql('t_video').select('*')
    }
    ctx.state.data = data
}