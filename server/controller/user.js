const userModel = require('../lib/mysql.js');

/**
 * 注册
 */
exports.postRegister = async (ctx) => {
  let { username, password, email, phone, question, answer } = ctx.request.body;
  console.log(username, password, email, phone, question, answer);
  //查询用户是否存在
  const result = await userModel.findDataByName('jack');
  console.log(result);
};
