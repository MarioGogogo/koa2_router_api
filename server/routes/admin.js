const { controller, get, post, del, auth, admin, required } = require('../lib/decorator');

@controller('/api/v0/admin')
export class adminController {
  @get('/movie/list')
  @admin('admin')
    //api:获取电影列表
  getMovieList(ctx, next) {
    console.log('admin movie list');
    ctx.body = {
      success : true,
      data    : 'movies'
    };
  }
  '';
}
