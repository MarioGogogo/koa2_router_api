const { controller, get, post, put } = require('../lib/decorator');
const userModel = require('../lib/mysql.js');

@controller('/api/v0/user')
export class userController {
  //api:查询数据库用户
  @get('/')
  async login(ctx, next) {
    const result = await userModel.findDataByName('jack');
    console.log(result);
    return (ctx.body = {
      success : false,
      err     : '用户'
    });
  }
}
