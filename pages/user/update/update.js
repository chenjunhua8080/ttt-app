// pages/user/phone/phone.js
const util=require('../../../util/util.js')
var app = getApp();
const date = new Date();
const years = [];
const months = [];
const days = [];
for (let i = 1990; i <= date.getFullYear(); i++) {
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
    value: [0, 0, 0]
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
  },
  formSubmit: function(e) {
    console.log(e);
    var that = this;
		var url = app.globalData.url + '/user/update';
		var data = {
      id: that.data.userId,
			nickname: e.detail.value.nickname,
			sex: e.detail.value.sex,
      birthday: that.data.birthday,
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
    this.setData({
      birthday: this.data.year + '-'+ util.addzero(this.data.month,2) + '-' + util.addzero(this.data.day,2)
    });
  }
})