const util = require("../../util/util.js")

var app = getApp()
Page({
	data: {
		hasLogin: false,
		hasToken: false,
		code: null,
		userId: null,
		user: null,
		page: null,
	},
	onLoad: function (options) {
		var that = this;
		var page = options.page || null;
		console.log(`from page -> ${page}`)
		//设置页面来源
		that.setData({
			page: page
		});
		tt.checkSession({
			success: function () {
				that.setData({
					hasLogin: true
				});
			},
			fail: function () {
				that.setData({
					hasLogin: false
				});
			}
		});
		var token = tt.getStorageSync('token');
		console.log("token -> " + token);
		var hasToken = (token == null||token == "") ? false : true;
		console.log(hasToken);
		that.setData({
			hasToken: hasToken
		});
		
		if(hasToken){
			//跳转页面
			that.toPage();
		}
	},
	/**
	 * 登录事件
	 */
	login: function () {
		var that = this;
		if(!that.data.hasToken){
			//授权登录
			that.ttLogin().then(isSuccess => {
				if (isSuccess == 'success') {
					//授权信息
					that.ttGetUserInfo().then(isSuccess => {
						if (isSuccess == 'success') {
							//授权位置
							that.getLocation().then(isSuccess => {
								if (isSuccess == 'success') {
									//登录系统
									that.sysLogin().then(isSuccess => {
										if (isSuccess == 'success') {
											//查询用户信息
											that.sysGetUserInfo().then(isSuccess => {
												if (isSuccess == 'success') {
													//页面跳转
													that.toPage();
												}
											});
										}
									});
								}
							});
						}
					})
				}
			});
		}else{
			//跳转页面
			that.toPage();
		}
	},
	/**
	 * 授权登录
	 */
	ttLogin: function(){
		var that = this;
		return new Promise(function(resolve, reject) {
			tt.login({
				success: function (res) {
					console.log('tt.login -> ');
					console.log(res);
					var code = res.code;
					if (res.code) {
						//设置data
						that.setData({
							hasLogin: true,
							code: res.code
						});
					} else {
						tt.showModal({
							title: '本地接口调用成功，但登录失败了'
						});
					}
					resolve('success');
				},
				fail: function (res) {
					tt.showToast({
						title: '授权登录失败', // 内容
						icon: 'fail'
					});
					resolve('success');
				}
			});
		})
	},
	/**
	 * 授权用户信息
	 */
	ttGetUserInfo: function(){
		var that = this;
		return new Promise(function(resolve, reject) {
			tt.getUserInfo({
				success: function (res) {
					console.log('tt.getUserInfo -> ');
					console.log(res);
					var user = res.userInfo;
					//设置data
					that.setData({
						user: user
					});
					resolve('success');
				},
				fail: function (res){
					console.log(res)
					tt.showToast({
						title: '获取用户信息失败', // 内容
						icon: 'fail'
					});
					resolve('fail');
				}
			});
		})
	},
	/**
	 * 登录系统
	 */
	sysLogin: function(){
		var that = this;
		return new Promise(function(resolve, reject) {
			var code = that.data.code;
			var user = that.data.user;
			var location = tt.getStorageSync('location');
			console.log(`location -> ${location}`);
			var url = app.globalData.url + '/user/login';
			var data = {
				code: code,
				nickname: user.nickName,
				avatar: user.avatarUrl,
				sex: user.gender,
				lng: location.lng,
				lat: location.lat,
			};
			app.request(
				'POST', url, data,
				(res) => {
					tt.setStorageSync('token', res.data.data.token);
					tt.setStorageSync('userId', res.data.data.userId);
					//设置data
					that.setData({
						hasToken: true,
						userId:  res.data.data.userId
					});
					tt.showToast({
						title: '登录成功',
						ico: 'success'
					});
					resolve('success');
				}
			);
		})
	},
	/**
	 * 查询用户信息
	 */
	sysGetUserInfo: function(){
		var that = this;
		return new Promise(function(resolve, reject) {
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
					resolve('success');
				}
			);
		})
	},
	/**
	 * 页面跳转
	 */
	toPage: function(){
		var that = this;
		console.log('to page -> ' + that.data.page);
		if(this.data.page != null){
			tt.navigateBack();
		}else{
			tt.switchTab({
				url: '/pages/user/user'
			});
		}
	},
	/**
	 * 获取位置
	 */
	getLocation: function(){
  		return new Promise(function(resolve, reject) {
			app.getLocation(
				(lng, lat) => {
					resolve('success');
				}
			);
		})
	}
})
