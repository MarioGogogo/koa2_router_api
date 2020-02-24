const { controller, get, post, put } = require('../lib/decorator');

@controller('/admin')
export class userController {
  @get('/login')
  async login(ctx, next) {
    return (ctx.body = {
      success : false,
      err     : '密码不正确'
    });
  }
}
