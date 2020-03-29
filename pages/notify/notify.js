// pages/notify/notify.js
const app = getApp()
const util = require("../../util/util.js")

Page({
  data: {
    pageData: null
  },
  /**
   * onLoad
   */
  onLoad: function (options) {

  },
  /**
 * onShow
 */
  onShow: function () {
    var that = this;

    //获取配对列表
    that.getPairSuccessList(1);
  },
  /**
   * 获取聊天记录
   */
  getPairSuccessList: function (current) {
    var that = this;
    return new Promise(function (resolve, reject) {

      var url = app.globalData.url + "/pair/getOkPairList";
      var data = {
        current: current,
        size: 10
      }
      app.request("GET", url, data,
        (res) => {
          let { pageData } = that.data;
          var newPageData = res.data.data;
          //叠加分页数据
          if (pageData && current != 1) {
            var list = pageData.records.concat(newPageData.records);
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
   * 滚动触低事件
   */
  onBottom: function () {
    var that = this;
    var { current } = that.data.pageData;
    var { pages } = that.data.pageData;
    if (current != pages) {
      tt.showLoading({
        title: '加载中'
      });
      that.getPairSuccessList(current + 1).then(() => {
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