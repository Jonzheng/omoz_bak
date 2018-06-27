const { mysql } = require('../qcloud')
const cos = require('../qcos')
const fs = require('fs')

const Bucket = 'image-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    var resp = ''
    var bucket_lst = []
    var src_image = ''
    var body = ctx.request.body
    console.log(body)
    var fields = body.fields
    var file_id = fields.file_id
    var flst = file_id.split("_") //["ssr", "xtz", "0", "1"]
    var level = flst[0]
    var s_name = flst[1]
    var ski = flst[2]
    var ver = flst[3]
    var cate = "y"
    var file = body.files.file
    var fileName = file_id + '.png'
    file.name = fileName

    var params = {
        Bucket: Bucket,
        Region: Region,
        ContentLength: file.size,
        Key: file.name,
        Body: fs.createReadStream(file.path)
    }

    var params_get = {
        Bucket: "video-1256378396",
        Region: Region,
        Prefix: file_id
    }

    function getVideo() {
        return new Promise((resolve, reject) => {
            cos.getBucket(params_get, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    bucket_lst = data
                }
                resolve()
            });
        })
    }

    await getVideo()
    var video_size = 0
    if (bucket_lst["Contents"].length > 0) video_size = bucket_lst["Contents"][0].Size
    
    function uploder() {
        return new Promise((resolve, reject) => {
            cos.putObject(params, function (err, data) {
                resp = err || data
                src_image = resp['Location']
                resolve()
            })
        })
    }
    //await 在async修饰的函数下,必须是Promise才有效果
    await uploder()

    await mysql('t_list').insert({
        file_id: file_id,
        src_video: fields.src_video,
        video_size: video_size,
        title: fields.title,
        serifu: fields.serifu,
        koner: fields.koner,
        roma: fields.roma,
        src_image: src_image,
        level: level,
        cate: cate,
        status: 1
    });

    await mysql('t_audio').insert({
        file_id: file_id,
        src_audio: fields.src_audio,
        c_name: fields.c_name,
        s_name: s_name,
        shadow: fields.shadow,
        level: level,
        ski: ski,
        ver: ver,
        cate: cate,
        status: 1
    });

    ctx.state.data = src_image
}


