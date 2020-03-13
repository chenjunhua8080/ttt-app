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
    userId: null,
    nickname: null,
    sex: null,
    birthday: null,
    phone: null,
    //时间
    years: years,
    year: 1990,
    months: months,
    month: 1,
    days: days,
    day: 1,
    value: [19, 0, 0]
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    //设置页面参数
    that.setData({
      userId: options.userId||null,
      nickname: options.nickname||null,
      sex: options.sex||null,
      birthday: options.birthday||null,
      phone: options.phone||null,
    });

    //设置时间选择器
    var birthday = that.data.birthday;
    if(birthday!=null){
      var y = util.format(birthday,'yyyy');
      y = util.getIndex(years,y);
      var m = util.format(birthday,'MM');
      m = util.getIndex(months,m);
      var d = util.format(birthday,'dd');
      d = util.getIndex(days,d);
      that.setData({
        value: [y,m,d]
      });
    }
  },
  formSubmit: function(e) {
    console.log(e);
    var that = this;
		var url = app.globalData.url + '/user/update';
		var data = {
      id: that.data.userId,
			nickname: e.detail.value.nickname,
			sex: e.detail.value.sex,
      birthday: util.format(that.data.birthday,'yyyy-MM-dd HH:mm:ss'),
      phone: e.detail.value.phone,
		};
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
    this.setData({
      birthday: date
    });
  }
})