const { uploader } = require('../qcloud')

module.exports = async ctx => {
    // 获取上传之后的结果
    // 具体可以查看：
    
    console.log(ctx.req)
    //var fields = body.fields
    //var file = body.files.file
    //console.log(file)
    //const data = await uploader(ctx.req)
    ctx.state.data = {foo:'jon'}
}
