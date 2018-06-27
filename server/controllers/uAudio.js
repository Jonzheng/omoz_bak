const { mysql } = require('../qcloud')
const cos = require('../qcos')

const Bucket = 'audio-1256378396'
const Region = 'ap-guangzhou'

module.exports = async ctx => {
    var res = ctx.res
    console.log(res)
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
        "Access-Control-Allow-Methods": "POST,GET,",
        "X-Powered-By": "3.2.1",
        'Content-Type': 'application/json;charset=utf-8'
    });
    let body = ctx.request.body
    var lst = ""

    var params = {
        Bucket: Bucket,
        Region: Region
    }

    function list() {
        return new Promise((resolve, reject) => {
            cos.getBucket(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    lst = data
                }
                resolve()
            });
        })
    }

    await list()

    var content = lst["Contents"]

    //查询
    var t_list = await mysql('t_audio').select('*')

    var result = {"content":content,"t_list":t_list}
    ctx.state.data = result
}