// pages/message/user/user.js
const util = require("../../../util/util.js")
var app = getApp()

Page({
  data: {
    user: null
  },
  /**
   * onLoad
   */
  onLoad: function (options) {
    var that = this;

    //查询用户信息
    var userId = options.id;
    that.getUserInfo(userId);
  },
  /**
   * 查询用户信息
   */
  getUserInfo: function (userId) {
    var that = this;
    var url = app.globalData.url + '/user/info/' + userId;
    app.request(
      'GET', url, null,
      (res) => {
        var user = res.data.data;
        user.birthday = util.format(user.birthday, 'yyyy-MM-dd');
        tt.setStorageSync('user', user);
        //设置data
        that.setData({
          user: user
        });
      }
    );
  },
  /**
     * 预览图片
     */
  previewImage: function (e) {
    app.previewImage(e);
  },
  /**
   * 按钮操作事件
   */
  action: function (e) {
    var { dataset } = e.target;
    var that = this;
    var url = app.globalData.url + '/pair/update';
    var data = {
      sender: that.data.user.id,
      status: dataset.status
    }
    app.request(
      'POST', url, data,
      (res) => {
        tt.showToast({
          title: dataset.status == 1 ? '配对完成~' : '已拒绝',
          success: (res) => {
            //返回上一页
            tt.navigateBack();
          }
        });
      }
    );
  }
})