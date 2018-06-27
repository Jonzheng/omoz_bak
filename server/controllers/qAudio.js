const { mysql } = require('../qcloud')

module.exports = async ctx => {
    let body = ctx.request.body
    var data = ""
    if (body.file_id){
        data = await mysql('t_audio').select('*').where('file_id', body.file_id)
    } else{
        data = await mysql('t_audio').select('*')
    }
    //const data = await mysql('t_audio').select('*').where('level', 1)
    //const data = await mysql('t_audio').select('*').leftJoin('t_list', 't_audio.file_id', 't_list.file_id')
    ctx.state.data = data
}