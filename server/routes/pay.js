const {
  controller,
  get,
  post,
  del,
  auth,
  admin,
  required,
} = require('../lib/decorator');
var xml2js = require('xml2js');
var request = require('request');
//工具方法
var get_xml = require('../utils/xml');

@controller('/api/v0')
export class payController {
  @post('/pay')
  async h5pay(ctx, next) {
    //预先生成一个结果
    var r = { code: 0, message: '成功！' };
    let pay_info_url = ""
    //解析参数
    const pars = ctx.request.body;
    //解析 xml
    let data = get_xml(pars);
    var xmlParser = new xml2js.Parser({
      explicitArray: false,
      ignoreAttrs: true,
    }); // xml -> json


    const params = {
      url: 'https://pay.swiftpass.cn/pay/gateway',
      method: 'POST',
      body: data,
    };

    // const params = {
    //   url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    //   method: 'POST',
    //   body: data,
    // };
    
    request(params, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        console.log('Body===>>>', body);
        xmlParser.parseString(body, function (err, result) {
          if (result.xml.status == 0){
              if (result.xml.result_code == 0){
                   pay_info_url = result.xml.pay_info; //返回支付接口
                  console.log('%c 🍾 pay_info_url: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', pay_info_url);
                  ctx.body = {
                    success: true,
                    url: pay_info_url,
                  };
              } else {
                  ctx.body = {
                    success: false,
                    msg: "接口参数异常",
                  };
              }
          } else {
              ctx.body = {
                success: false,
                msg: "接口参数异常",
              };
          };
         if(err){
          ctx.body = {
            success: false,
            msg: "接口参数异常",
          };
         }
      });
      } else {
        ctx.body = {
          success: false,
          msg: "接口参数异常",
        };
      }
    });
  }
}
