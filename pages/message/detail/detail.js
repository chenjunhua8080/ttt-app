// pages/message/detail/detail.js
const app = getApp()
const util = require("../../../util/util.js")

Page({
  data: {
    messageId: 0,
    user: null,
    target: null,
    pageData: null,
    content: '',
    scrollTop: 0,
    toViewId: 'toViewId:9'
  },
  /**
   * onLoad
   */
  onLoad: function (options) {
    var that = this;

    //封装对方资料
    var target = {
      id: options.targetId,
      nickname: options.targetNickname,
      avatar: options.targetAvatar,
    }

    //设置data
    that.setData({
      messageId: options.messageId,
      target: target,
      user: tt.getStorageSync('user')
    })

    //设置标题
    tt.setNavigationBarTitle({
      title: target.nickname
    });
  },
  /**
   * onShow
   */
  onShow: function () {
    var that = this;

    //获取聊天记录
    that.getMsgDetailList(1).then(() => {
      //设置滚动条
      that.setData({
        scrollTop: that.data.pageData.total * 100
      });
    });
  },
  /**
   * 获取聊天记录
   */
  getMsgDetailList: function (current) {
    var that = this;
    return new Promise(function (resolve, reject) {

      var url = app.globalData.url + "/msg/detail/list";
      var data = {
        current: current,
        size: 10,
        messageId: that.data.messageId,
      }
      app.request("GET", url, data,
        (res) => {
          var today = util.format(new Date, 'yyyy-MM-dd');
          let { pageData } = that.data;
          var newPageData = res.data.data;
          //转换时间
          newPageData.records.forEach((item) => {
            var date = item.createTime;
            date = util.format(date, 'yyyy-MM-dd');
            if (today === date) {
              date = util.format(item.createTime, 'HH:mm:ss');
            } else {
              date = util.format(item.createTime, 'yyyy-MM-dd HH:mm:ss');
            }
            item.createTime = date;
          });
          newPageData.records.reverse();
          //叠加分页数据
          if (pageData && current != 1) {
            var list = newPageData.records.concat(pageData.records);
            newPageData.records = list;
          }
          pageData = newPageData;
          that.setData({
            pageData
          });
          resolve('success');
        }
      );
    });
  },
  /**
   * 输入框失去焦点事件
   */
  bindblur: function (e) {
    this.setData({
      content: e.detail.value
    });
  },
  /**
   * 发送按钮点击事件
   */
  sendMsg: function () {
    var that = this;
    var url = app.globalData.url + "/msg/send";
    var data = {
      messageId: that.data.messageId,
      content: that.data.content || null
    }
    if (data.content == null || data.content === '' || data.content.length == 0) {
      tt.showToast({
        title: '说点什么吧',
        icon: 'none',
        duration: 200
      });
      return;
    }
    app.request("POST", url, data,
      (res) => {
        //清除输入框
        that.setData({
          content: ''
        })
        //刷新请求
        that.getMsgDetailList(1);
      }
    );
  },
  /**
   * 滚动事件
   */
  bindscroll: function (e) {
    console.log(e)
  },
  /**
   * 滚动触顶事件
   */
  onTop: function () {
    var that = this;
    var { current } = that.data.pageData;
    var { pages } = that.data.pageData;
    if (current != pages) {
      tt.showLoading({
        title: '加载中'
      });
      that.getMsgDetailList(current + 1).then(() => {
        tt.hideLoading();
      });
    } else {
      tt.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 500
      });
    }
  }
})