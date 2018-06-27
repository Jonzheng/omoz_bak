const { mysql } = require('../qcloud')
const cos = require('../qcos')
const folder = 'upload/'

module.exports = async ctx => {
    var resp = 'err'
    var body = ctx.request.body
    console.log(body)
    var fields = body.fields
    var file = body.files.file
    var key = folder + 'test.MP4'
    file.name = key
    console.log(file)
    cos.sliceUploadFile({
        Bucket: 'test-1256378396',
        Region: 'ap-guangzhou',
        Key: file.name,
        FilePath: file.path
    }, function (err, data) {
        console.log(err, data);
        resp = data
    });

    ctx.state.data = resp
}