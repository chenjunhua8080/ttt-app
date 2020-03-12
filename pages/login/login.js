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
		var hasToken = token == "" ? false : true;
		console.log(hasToken);
		that.setData({
			hasToken: hasToken
		});
		var userId = tt.getStorageSync('userId');
		console.log("userId -> " + userId);
		that.setData({
			userId: userId
		});

		if(hasToken){
			//跳转页面
			that.toPage();
		}
	},
	//登录
	login: function () {
		var that = this;
		if(!that.data.hasToken){
			//授权登录
			that.ttLogin();
		}else{
			//跳转页面
			that.toPage();
		}
	},
	ttLogin: function(){
		var that = this;
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
					//获取信息
					that.getUserInfo(code);
				} else {
					tt.showModal({
						title: '本地接口调用成功，但登录失败了'
					});
				}
			},
			fail: function () {
				tt.showModal({
					title: '调用登录接口失败'
				});
			}
		});
	},
	//获取用户信息
	getUserInfo: function(code){
		var that = this;
		tt.getUserInfo({
			success: function (res) {
				console.log('tt.getUserInfo -> ');
				console.log(res);
				var user = res.userInfo;
				//设置data
				that.setData({
					user: user
				});
				//设置缓存
				tt.setStorageSync('user', user);
				//系统登录
				that.sysLogin(code,user);
			},
			fail: function (res){
				console.log(res)
				tt.showToast({
				  title: '获取用户信息失败', // 内容
				  icon: 'fail'
				});
			}
		});
	},
	//系统登录
	sysLogin: function(code,user){
		var that = this;
		var url = app.globalData.url + '/user/login';
		var data = {
			code: code,
			nickname: user.nickName,
			avatar: user.avatarUrl,
			sex: user.gender
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
					ico: 'success',
					success: (res) => {
						//跳转页面
						that.toPage();
					}
				});
			}
		);
	},
	//页面跳转
	toPage: function(){
		var that = this;
		console.log('to page -> ' + this.data.page);
		if(this.data.page != null){
			tt.navigateBack();
		}else{
			tt.switchTab({
				url: '/pages/user/user'
			});
		}
	}
})
