const { mysql } = require('../qcloud')
const cos = require('../qcos')
const path = require('path')
const fs = require('fs')

const Folder = 'audio/'
const Bucket = 'omoz-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    var resp = ''
    var src_path = ''
    let body = ctx.request.body
    var fields = body.fields
    let file = body.files.file
    let fileName = fields.file_id + '.MP3'
    let key = path.join(Folder, fileName)
    file.name = key

    var params = {
        Bucket: Bucket,
        Region: Region,
        ContentLength: file.size,
        Key: file.name,
        Body: fs.createReadStream(file.path)
    }

    function uploder(){
        return new Promise((resolve, reject) => {
            cos.putObject(params, function (err, data) {
                resp = err || data
                src_path = resp['Location']
                resolve()
            })
        })
    }
    //await 在async修饰的函数下,必须是Promise才有效果
    await uploder()

    await mysql('t_audio').insert({
        file_id: fields.file_id,
        src_path: src_path,
        c_name: fields.c_name,
        s_name: fields.s_name,
        level: fields.level,
        cate: fields.cate,
        ski: fields.ski,
        ver: fields.ver
    });
    
    ctx.state.data = src_path
}


