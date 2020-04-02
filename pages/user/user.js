const util = require("../../util/util.js")
var app = getApp()
Page({
	data: {
		hasToken: false,
		user: {},
		updateFields: [
			'avatar','nickname','sex','birthday','phone'
		]
	},
	onLoad: function () {
		//onLoad
	},
	/**
	 * 查询用户信息
	 */
	getUserInfo: function(){
		var that = this;
		
		var userId = tt.getStorageSync('userId');
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
	/**
	 * 更新我的位置
	 */
	changeLocation: function(){
		var that = this;
		app.getLocation(
			(lng,lat)=>{
				var url = app.globalData.url + '/address/update';
				var data = {};
				data.lng = lng;
				data.lat = lat;
				app.request(
					'POST', url, data,
					(res) => {
						that.getUserInfo();
					}
				)
			}
		);
	},
	/**
	 * 更新用户信息
	 */
	onShow: function() {
		var that = this;	
		var token = tt.getStorageSync('token');
		var hasToken = token == "" ? false : true;
		that.setData({
			hasToken: hasToken
		});
		//跳转登录页面
		if(!hasToken){
			tt.navigateTo({
				url: '/pages/login/login'
			});
		}else{
			//获取用户信息
			this.getUserInfo();
		}
	},
})
