const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const koaBody = require('koa-body');
const config = require('./config')

// 使用响应处理中间件
app.use(response)
// 解析请求体
app.use(koaBody({ formLimit: '100mb', jsonLimit: '100mb', textLimit: '100mb', multipart: true}));
//app.use(koaBody());

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
