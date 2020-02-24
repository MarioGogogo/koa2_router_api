const Koa = require('koa');
const { resolve } = require('path');
const views = require('koa-views');
const R = require('ramda');
const MIDDLEWARES = [ 'common', 'router' ];

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
  //views
  app.use(
    views(resolve(__dirname, '../views'), {
      extension : 'html'
    })
  );

  // error logger
  app.on('error', (err, ctx) => {
    console.log('error occured:', err);
  });

  await useMiddlewares(app);
  // 监听端口
  app.listen(4455, () => {
    console.log('http://127.0.0.1:4455 is runing');
  });
})();
