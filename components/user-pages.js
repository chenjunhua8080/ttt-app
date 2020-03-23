// components/user-pages.js
const app = getApp()

Component({
  data: {

  },
  properties: {
    pageData: Object,
    type: Number,
  },
  methods: {
    scroll: function (e) {
      var that = this;
      var { current } = that.data.pageData;
      var { pages } = that.data.pageData;
      var { type } = that.data;
      if (current != pages) {
        that.getPairList(current + 1, type);
      }else{
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
          that.setData({
            pageData: res.data.data.pageData
          });
        }
      );
    }
  },
  attached: function () {
    console.log(this.data);
  },
})