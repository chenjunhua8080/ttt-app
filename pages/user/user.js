const util = require("../../util/util.js")
var app = getApp()
Page({
	data: {
		hasToken: false,
		user: {},
		update: [
			'nickname','sex','birthday','phone'
		]
	},
	onLoad: function () {
		var that = this;	
		var token = tt.getStorageSync('token');
		console.log("token -> " + token);
		var hasToken = token == "" ? false : true;
		console.log('hasToken -> ' + hasToken);
		that.setData({
			hasToken: hasToken
		});
		//跳转登录页面
		if(!hasToken){
			tt.navigateTo({
				url: '/pages/login/login'
			});
		}
	},
	getUserInfo: function(){
		var that = this;
		
		var userId = tt.getStorageSync('userId');
		console.log("userId -> " + userId);

		var url = app.globalData.url + '/user/info/'+userId;
		app.request(
			'GET', url, null,
			(res) => {
				var user = res.data.data;
				user.birthday = util.format(user.birthday,'yyyy-MM-dd');
				tt.setStorageSync('user', user);
				//设置data
				that.setData({
					user: user
				});
			}
		);
	},
	onShow: function() {
		console.log("onShow...");
		//获取用户信息
		this.getUserInfo();
	},
})
