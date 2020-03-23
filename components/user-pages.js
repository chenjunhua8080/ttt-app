// components/user-pages.js
const util = require("../util/util.js")
const app = getApp()

Component({
  data: {
    id: null,
    check: true,
  },
  properties: {
    pageData: Object,
    type: Number,
  },
  methods: {
    /**
      * 滚动条到边事件
      */
    scroll: function (e) {
      var that = this;
      var { current } = that.data.pageData;
      var { pages } = that.data.pageData;
      var { type } = that.data;
      if (current != pages) {
        that.getPairList(current + 1, type);
      } else {
        tt.showToast({
          title: '没有更多了',
          icon: 'none'
        });
      }
    },
    /**
      * 获取匹配列表
      */
    getPairList: function (current, type) {
      var that = this;
      var url = app.globalData.url + "/pair/list";
      var data = {
        current: current,
        size: 3,
        type: type
      }
      app.request("GET", url, data,
        (res) => {
          //覆盖分页信息，叠加查询结果
          var { records } = that.data.pageData;
          var pageData = res.data.data.pageData;
          var list = records.concat(pageData.records);
          pageData.records = list;
          list.forEach((item) => {
            item.birthday = util.format(item.birthday, 'yyyy-MM-dd');
          });
          that.setData({
            pageData: res.data.data.pageData
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
     * 配对点击事件
     */
    pair: function (e) {
      console.log(e);
      var that = this;
      var index = e.target.dataset.index;
      var item = that.data.pageData.records[index];
      var id = item.id;
      var sex = item.sex;
      var { type } = that.data;
      //检测
      that.check(id).then(isSuccess => {
        if (isSuccess == 'success') {
          var { check } = that.data;
          if (check) {
            that.pairing(id, '', type);
          } else {
            tt.showModal({
              title: `渣${sex == 1 ? '男' : '女'}警告`,
              confirmText: '继续',
              content: "对方配对成功超过5次请注意~",
              success: (res) => {
                if (res.confirm) {
                  that.pairing(id, '', type);
                }
              }
            });
          }
        }
      });
    },
    /**
     * 配对检测
     */
    check: function (id) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var url = app.globalData.url + "/pair/check";
        var data = {
          id: id
        }
        app.request("GET", url, data,
          (res) => {
            var count = res.data.data;
            if (count >= 5) {
              that.setData({
                check: false
              })
            } else {
              that.setData({
                check: true
              })
            }
            resolve('success');
          }
        );
      });
    },
    /**
     * 执行配对
     */
    pairing: function (id, content, channel) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var url = app.globalData.url + "/pair/pairing";
        var data = {
          id: id,
          content: content,
          channel: channel,
        }
        app.request("POST", url, data,
          (res) => {
            tt.showToast({
              title: '已发送', // 内容
            });
            var pageData = that.data.pageData;
            var records = pageData.records;
            records.forEach((item) => {
              if (item.id === id) {
                item.pairStatus = 0;
                console.log(item);
              }
            });
            that.setData({
              pageData: pageData
            })
            resolve('success');
          }
        );
      });
    }
  },
  /**
   * 组件被加载
   */
  attached: function () {
    console.log(this.data);
  },
})