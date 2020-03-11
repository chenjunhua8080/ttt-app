var app = getApp()
Page({
	data: {
		hasLogin: false,
		code: tt.getStorageSync('login.code')
	},
	onLoad: function () {
		var that = this;
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
		})
	},
	login: function () {
		var that = this
		tt.login({
			success: function (res) {
				if (res.code) {
					//设置登录code
					that.setData({
						hasLogin: true,
						code: res.code
					});
					//获取用户信息
					tt.getUserInfo({
						withCredentials: true,
						success: function (res) {
							console.info('get user info data is ', res);
							//调用服务器登录
							var user=res.userInfo;
							sysLogin(
								user.nickName,
								user.avatarUrl,
								user.gender
							);
						},
						fail() {
							tt.showModal({
								title: '请先授权登录'
							})
						}
					});
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
		})
	},
	//系统登录
	sysLogin: function(nickname,avatar,sex){
		tt.request({
			url: 'https://docs.bytedance.net/api/resource_package/get_info/?package_version=17',
			data: {
				nickname: nickname,
				avatar: avatar,
				sex: sex
			},
			//登录成功
			success: function(result) {
				console.log(result);
				tt.showToast({
					title: '请求成功',
					icon: 'success',
				});
			},
			fail: function({errMsg}) {
				tt.showToast({
					title: 'req fail'
				});
			}
		});
	}

})
