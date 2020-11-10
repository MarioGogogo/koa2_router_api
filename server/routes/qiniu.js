import { reject } from 'lodash';

const { controller, get, post, put } = require('../lib/decorator');
const qiniu = require('qiniu');
const { resolutionTime } = require('../utils/util');
@controller('/api/v0')
export class qiniuController {
  //api:获取七牛云token
  @get('/getToken')
  async getToken(ctx, next) {
    // accessKey，secretKey 在个人中心可以查看
    const accessKey = 'toY7J37YRhafqwU8wAqyDlK5jtEtgP3zW5GtmYV6';
    const secretKey = 'ynDwvoGnVhqpEUQWdR_6RqTxkdQnAA9C5zandR5o';
    // 鉴权对象 mac
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'mall', // 仓库名
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);
    const key = +new Date() + Math.random().toString(16).slice(2); // key 只需要随机不重复就可以
    ctx.body = { status: 1, data: { token, key } };
  }
  //api:获取七牛云所有图片
  @get('/getList')
  async getList(ctx) {
    //获取数据量
    const limit = ctx.query.limit;
    // accessKey，secretKey 在个人中心可以查看
    const accessKey = 'toY7J37YRhafqwU8wAqyDlK5jtEtgP3zW5GtmYV6';
    const secretKey = 'ynDwvoGnVhqpEUQWdR_6RqTxkdQnAA9C5zandR5o';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    // config.useHttpsDomain = true;
    config.zone = qiniu.zone.Zone_z0;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    var srcBucket = 'mall';
    // @param options 列举操作的可选参数
    //                prefix    列举的文件前缀
    //                marker    上一次列举返回的位置标记，作为本次列举的起点信息
    //                limit     每次返回的最大列举文件数量
    //                delimiter 指定目录分隔符
    var options = {
      limit: limit,
    };
    if (limit == 0) return (ctx.body = { status: 1, data: [] });
    const res = await asyncGetListPrefixV2(bucketManager, srcBucket, options, limit);
    ctx.body = { status: 1, data: res };
  }
  //api:删除七牛云一张图片
  @post('/deteleQiniuImage')
  async deteleQiniuImage(ctx) {
    let { key } = ctx.request.body;
    const accessKey = 'toY7J37YRhafqwU8wAqyDlK5jtEtgP3zW5GtmYV6';
    const secretKey = 'ynDwvoGnVhqpEUQWdR_6RqTxkdQnAA9C5zandR5o';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    var bucket = 'mall';
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    const res = await asyncDeteleImage(bucketManager, bucket, key);
    if (res.statusCode === 200) {
      ctx.body = { success: true, msg: '删除成功' };
    } else {
      ctx.body = { success: false, msg: res.data.error };
    }
  }
  //api:（还没有完成测试） 批量删除图片
  @post('/deletePicturesInBulk')
  async deletePicturesInBulk(ctx) {
    let { keys } = ctx.request.body;
    // 循环遍历keys插入下面数组
    //每个operations的数量不可以超过1000个，如果总数量超过1000，需要分批发送
    var deleteOperations = [
      qiniu.rs.deleteOp(srcBucket, 'qiniu1.mp4'),
      qiniu.rs.deleteOp(srcBucket, 'qiniu2.mp4'),
      qiniu.rs.deleteOp(srcBucket, 'qiniu3.mp4'),
      qiniu.rs.deleteOp(srcBucket, 'qiniu4x.mp4'),
    ];
    const res = await asyncDeteleAllImage(bucketManager, deleteOperations);
    ctx.body = { success: true, msg: '全部删除成功' };
  }
}

//获取全部图片
const asyncGetListPrefixV2 = (bucketManager, srcBucket, options, limit) => {
  return new Promise((reslove, reject) => {
    return bucketManager.listPrefixV2(srcBucket, options, (err, respBody, respInfo) => {
      if (err && err.res.statusCode != 200) {
        reject(err);
        throw err;
      }
      let newArr = [];
      //如果limit是1则直接返回respBody对象 否则 respBody是字符串
      if (limit == 1) {
        newArr.push(respBody.item);
        reslove(newArr);
      } else {
        //解析respBody
        const res = respBody.split('\n');
        res.forEach((item) => {
          //数组最后一位是空要去除
          if (item) {
            const arr = JSON.parse(item);
            //时间戳转换
            let newItem = arr.item;
            if (arr.item.putTime) {
              newItem = Object.assign({}, arr.item, {
                ctime: resolutionTime(arr.item.putTime),
              });
            }
            newArr.push(newItem);
          }
        });
        reslove(newArr);
      }
    });
  });
};

//删除七牛云图片
const asyncDeteleImage = async (bucketManager, bucket, key) => {
  return new Promise((reslove, reject) => {
    return bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
        reslove(respInfo);
      }
    });
  });
};

//批量删除图片
const asyncDeteleAllImage = async (bucketManager, deleteOperations) => {
  return new Promise((reslove, reject) => {
    return bucketManager.batch(deleteOperations, function (err, respBody, respInfo) {
      if (err) {
        console.log(err);
        //throw err;
      } else {
        // 200 is success, 298 is part success
        if (parseInt(respInfo.statusCode / 100) == 2) {
          respBody.forEach(function (item) {
            if (item.code == 200) {
              console.log(item.code + '\tsuccess');
            } else {
              console.log(item.code + '\t' + item.data.error);
            }
          });
        } else {
          console.log(respInfo.deleteusCode);
          console.log(respBody);
        }
      }
    });
  });
};
