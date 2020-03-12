var app = getApp()
Page({
	data: {
		hasToken: false,
		user: {}
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
			tt.redirectTo({
				url: '/pages/login/login'
			});
		}
		//获取用户信息
		that.getUserInfo();
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
				tt.setStorageSync('user', user);
				//设置data
				that.setData({
					user: user
				});
			}
		);
	}
})
