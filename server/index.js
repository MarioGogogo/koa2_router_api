const Koa = require('koa');

//创建实例
const app = new Koa();

// 路由路径
const index = require('./routes');

//router
app.use(index.routes(), index.allowedMethods());

// error logger
app.on('error', (err, ctx) => {
  console.log('error occured:', err);
});

app.listen(4455, () => {
  console.log('http://127.0.0.1:4455 is runing');
});
