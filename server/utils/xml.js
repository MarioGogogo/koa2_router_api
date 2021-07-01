let crypto = require('crypto');
const get_xml= (pars)=> {
  let out_trade_no = ('' + Math.random() * 10).substr(2);
  let nonce_str = ('' + Math.random() * 10).substr(2);
  console.log(pars.money);
  //MD5
  //可按照a-z顺序添加
  let sig =
    'attach=支付成功后在查询API和支付通知API中原样返回' + //注意长度限制
    '&body=接口测试' +
    '&callback_url=https://60.190.224.114/test?type=10' + //支付成功后返回的页面
    '&device_info=AND_WAP' +
    '&mch_app_id=https://60.190.224.114' +
    '&mch_app_name=应用名' +
    '&mch_create_ip=60.190.224.114' + //IP地址
    '&mch_id=175510359638' + //商户号
    '&nonce_str=' +
    nonce_str +
    '&notify_url=https://60.190.224.114/notice' + //接收支付成功的地址
    '&out_trade_no=' +
    out_trade_no +
    '&service=pay.weixin.wappay' +
    '&total_fee=' +
    pars.money +
    '&key=61307e5f2aebcacecbcca6fe5296df9c'; //密匙
//密匙
    let sig111 = `attach=123459&body=测试购买商品&charset=UTF-8&mch_create_ip=60.190.224.114&mch_id=175510359638&nonce_str=${nonce_str}&notify_url=http://127.0.0.1/notice/testPayResult&out_trade_no=${out_trade_no}&service=pay.weixin.native&sign_type=RSA_1_256&total_fee=${pars.money}&version=2.0&key=61307e5f2aebcacecbcca6fe5296df9c`

  let md5 = crypto.createHash('md5');
  let hash = md5.update(sig).digest('hex').toUpperCase();

  /**
   * 先通过MD5加密
   * 再XML上传
   */
  console.log('Hash===>', hash);


  let data =
    '<xml>' +
    '<attach>支付成功后在查询API和支付通知API中原样返回</attach>' +
    '<body>商品描述</body>' +
    '<callback_url>http://127.0.0.1/test?type=10</callback_url>' +
    '<device_info>AND_WAP</device_info>' +
    '<mch_app_id>http://127.0.0.1</mch_app_id>' +
    '<mch_app_name>应用名</mch_app_name>' +
    '<mch_create_ip>60.190.224.114</mch_create_ip>' +
    '<mch_id>175510359638</mch_id>' +
    '<nonce_str>' +
    nonce_str +
    '</nonce_str>' +
    '<notify_url>http://60.190.224.114/notice</notify_url>' +
    '<out_trade_no>' +
    out_trade_no +
    '</out_trade_no>' +
    '<service>pay.weixin.wappay</service>' +
    '<sign_type>RSA_1_256</sign_type>' +
    '<sign>' +
    hash +
    '</sign>' +
    '<total_fee>' +
    pars.money +
    '</total_fee>' +
    '</xml>';

  console.log('xmlDate===>>>', data);
  return data
  // Body===>>> <xml><charset><![CDATA[UTF-8]]></charset>
  // <mch_id><![CDATA[175510359638]]></mch_id>
  // <nonce_str><![CDATA[730683948100785]]></nonce_str>
  // <pay_info><![CDATA[https://statecheck.swiftpass.cn/pay/wappay?token_id=1b13b4915e002be46813f872163c0661d&service=pay.weixin.wappayv2]]></pay_info>
  // <result_code><![CDATA[0]]></result_code>
  // <sign><![CDATA[BE31C898E82C35F3637F6BD726A40BFE]]></sign>
  // <sign_type><![CDATA[MD5]]></sign_type>
  // <status><![CDATA[0]]></status>
  // <version><![CDATA[2.0]]></version>
  // </xml>
}


const get_xml111 =(pars)=> {

  
  //商户订单号
  let out_trade_no = ('' + Math.random() * 10).substr(2);
  //随机字符串
  let nonce_str = ('' + Math.random() * 10).substr(2);
  let key = "61307e5f2aebcacecbcca6fe5296df9c"

  //md5 签名方法
  let stringSignTemp= `appid=175510359638&body=JSAPI支付测试&device_info=1000&mch_id=1483469312&nonce_str=${nonce_str}&key=${key}` //注：key为商户平台设置的密钥key

  let md5 = crypto.createHash('md5');
  let sign = md5.update(stringSignTemp).digest('hex').toUpperCase();
  // sign=MD5(stringSignTemp).toUpperCase()="9A0A8659F005D6984697E2CA0A9CF3B7" //注：MD5签名方式




    let data = `
    <xml>
    <appid>175510359638</appid>
    <attach>支付测试</attach>
    <body>JSAPI支付测试</body>
    <mch_id>1483469312</mch_id>
    <detail><![CDATA[{ "goods_detail":[ { "goods_id":"iphone6s_16G", "wxpay_goods_id":"1001", "goods_name":"iPhone6s 16G", "quantity":1, "price":528800, "goods_category":"123456", "body":"苹果手机" }, { "goods_id":"iphone6s_32G", "wxpay_goods_id":"1002", "goods_name":"iPhone6s 32G", "quantity":1, "price":608800, "goods_category":"123789", "body":"苹果手机" } ] }]]></detail>
    <nonce_str>${nonce_str}</nonce_str>
    <notify_url>https://wxpay.wxutil.com/pub_v2/pay/notify.v2.php</notify_url>
    <out_trade_no>${out_trade_no}</out_trade_no>
    <spbill_create_ip>14.23.150.211</spbill_create_ip>
    <total_fee>1</total_fee>
    <trade_type>MWEB</trade_type>
    <sign>${sign}</sign>
  </xml>`
  console.log(data);
  return data
}


module.exports = get_xml;