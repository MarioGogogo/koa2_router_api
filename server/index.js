const Koa = require('koa');
const { resolve } = require('path');
const koaStatic = require('koa-static');
const R = require('ramda');
const MIDDLEWARES = [ 'common', 'router' ];
const bodyParser = require('koa-bodyparser')

/**
 * 封装中间件
 * @param {*} app 
 */
const useMiddlewares = (app) => {
  R.map(
    R.compose(R.forEachObjIndexed((initWith) => initWith(app)), require, (name) =>
      resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES);
};

(async () => {
  //创建实例
  const app = new Koa();

  // 配置静态资源
  const staticPath = '../views';
  app.use(koaStatic(resolve(__dirname, staticPath)));
  //解析post请求的参数
  app.use(bodyParser())
  // error logger
  app.on('error', (err, ctx) => {
    console.log('error occured:', err);
  });
  //执行中间件
  await useMiddlewares(app);
  // 监听端口
  app.listen(4455, () => {
    console.log('http://127.0.0.1:4455 is runing');
  });
})();
