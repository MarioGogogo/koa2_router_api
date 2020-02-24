const { controller, get, post, put } = require('../lib/decorator');

@controller('/api/v0/user')
export class userController {
  @get('/')
  async login(ctx, next) {
    return (ctx.body = {
      success : false,
      err     : '用户'
    });
  }
}
