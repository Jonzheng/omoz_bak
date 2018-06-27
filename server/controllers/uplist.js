const { mysql } = require('../qcloud')
const { uploader } = require('../qcloud')

const cos = require('../qcos')

const params = {
    Bucket: 'test-1256378396',    /* 必须 */
    Region: 'ap-guangzhou',    /* 必须 */
}

module.exports = async ctx => {

    // 获取上传之后的结果
    // 具体可以查看：
    //const data = await mysql('t_list').select('*')
    //mysql('table').insert({a: 'b'}).returning('*').toString();
    //mysql('table').where('published_date', '<', 2000).update({a: 'b'}).returning('*').toString();
    //const req = ctx.req;
    //console.log("--req--")
    //console.log(req)
    const request = ctx.request;
    //console.log("--ctx.request--")
    //console.log(request)
    const body = request.body
    const file = body.files.file
    file.name="upload/2.png"
    const file_path = file.path
    console.log(file)
    //const resp = await uploader(req)
    //ctx.state.data = resp
    //console.log(cos)
    //console.log("---")
    //cos.getService(params, function (err, data) {
    //    if (err) {
    //        console.log(err);
    //    } else {
    //        console.log(data);
    //    }
    //});

    cos.sliceUploadFile({
        Bucket: 'test-1256378396',
        Region: 'ap-guangzhou',
        Key: file.name,
        FilePath: file_path
    }, function (err, data) {
        console.log(err, data);
    });


}