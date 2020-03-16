// pages/user/phone/phone.js
const util=require('../../../util/util.js')
var app = getApp();
const date = new Date();
const years = [];
const months = [];
const days = [];
for (let i = 1970; i <= date.getFullYear(); i++) {
  years.push(i);
}
for (let i = 1; i <= 12; i++) {
  months.push(i);
}
for (let i = 1; i <= 31; i++) {
  days.push(i);
}
Page({
  data: {
    //时间组件
    years: years,
    year: 1990,
    months: months,
    month: 1,
    days: days,
    day: 1,
    value: [20, 0, 0],

    //更新字段
    updateFields: [
			'avatar','nickname','sex','birthday','phone'
		],
    field: null,
    user: null,
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    //设置页面参数
    that.setData({
      field: options.field,
      user: tt.getStorageSync('user')
    });
    if(options.field==that.data.updateFields[3]){
      var user = that.data.user;
      var birthday = user.birthday;
      if(birthday != null){
        var year = util.format(birthday,'yyyy');
        var month = util.format(birthday,'MM');
        var day = util.format(birthday,'dd');
        this.setData({
          year: year,
          month: month,
          day: day,
          value: [
            util.getIndex(that.data.years,year),
            util.getIndex(that.data.months,month),
            util.getIndex(that.data.days,day)
          ]
        });
      }
    }
  },
  formSubmit: function(e) {
    console.log(e);
    var that = this;
		var url = app.globalData.url + '/user/update';
    var user = that.data.user;
    user.phone = null;
    var fields = that.data.updateFields;
    switch(that.data.field){
      case fields[1]:
        user.nickname=e.detail.value.nickname;
        break;
      case fields[2]:
        user.sex=e.detail.value.sex;
        break;
      case fields[4]:
        user.phone=e.detail.value.phone;
        break;
    }
    var date = util.format(user.birthday,'yyyy-MM-dd HH:mm:ss');
    user.birthday = date;
    this.setData({
      user: user
    });
		var data = this.data.user;
		app.request(
			'POST', url, data,
			(res) => {
        tt.navigateBack();
      }
    );
  },
  //改变时间
  bindChange: function(e) {
    const val = e.detail.value;
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    });
    var date = util.format(this.data.year + '-'+ this.data.month + '-' + this.data.day,'yyyy-MM-dd HH:mm:ss');
    var user = this.data.user;
    user.birthday = date;
    this.setData({
      user: user
    });
  },
  //换头像
  changeAvatar: function(){
    var that = this;
    //选择文件
    tt.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1,
      success (res) {
        console.log('选择文件 -> ');
        console.log(res);
        var filePath = res.tempFilePaths[0];
        var url = app.globalData.url + '/system/upload';
        app.upload(
          url,filePath,
          (res) => {
            var user = that.data.user;
            user.avatar = res.data.data;
            that.setData({
              user: user
            });
          }
        );
      },
      fail (res) {
        tt.showToast({
          title: res.errMsg,
        });
      }
    });
  },
  //预览
  previewImage: function (e) {
    var current = e.target.dataset.src;
    tt.previewImage({
      current: current,
      urls: this.data.imageList
    });
  }
})