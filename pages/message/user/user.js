// pages/message/user/user.js
const util = require("../../../util/util.js")
var app = getApp()

Page({
  data: {
    user: null,
    action: null,
    pair: null,
    channel: ['命中注定', '专属推荐', '离我最近', '用户资料卡片']
  },
  /**
   * onLoad
   */
  onLoad: function (options) {
    var that = this;
    var userId = options.id;

    //查询用户信息
    that.getUserInfo(userId);
    //获取配对信息
    that.getPairInfo(userId);

    //设置操作权限
    var action = options.action || null;
    that.setData({
      action: action
    })
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
        //设置data
        that.setData({
          user: user
        });
      }
    );
  },
  /**
   * 查询配对信息
   */
  getPairInfo: function (userId) {
    var that = this;
    var url = app.globalData.url + '/pair/info/' + userId;
    app.request(
      'GET', url, null,
      (res) => {
        var pair = res.data.data;
        //设置data
        that.setData({
          pair: pair
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
   * [接受/拒绝]配对操作事件
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
  },
  /**
   * 解除配对操作事件
   */
  relieve: function () {
    var that = this;
    tt.showModal({
      title: `解除确认`,
      confirmText: '继续',
      content: "解除后将对方从你的会话列表移除",
      success: (res) => {
        if (res.confirm) {
          //发起请求
          var url = app.globalData.url + '/pair/relieve';
          var data = {
            userId: that.data.user.id
          }
          app.request(
            'POST', url, data,
            (res) => {
              tt.showToast({
                title: '已解除',
                success: (res) => {
                  //返回消息列表
                  tt.switchTab({
                    url: '/pages/message/message'
                  });;
                }
              });
            }
          );
        }
      }
    });
  },
  /**
   * 重新配对操作事件
   */
  rePair: function () {
    var that = this;

    //发起请求
    var url = app.globalData.url + '/pair/pairing';
    var data = {
      id: that.data.user.id,
      content: '',
      channel: 4
    }
    app.request(
      'POST', url, data,
      (res) => {
        tt.showToast({
          title: '已发送',
          success: (res) => {
            //返回上页
            tt.navigateBack();
          }
        });
      }
    );
  }
})