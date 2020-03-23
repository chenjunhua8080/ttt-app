const app = getApp()

Page({
	data: {
		hasToken: false,
		user: {},
		list: [
			{
				type: '3',
				name: '离我最近',
				open: true,
				pageData: null
			}, {
				type: '1',
				name: '命中注定',
				pageData: null
			}, {
				type: '2',
				name: '专属推荐',
				pageData: null
			}
		],
	},
	onLoad: function () {
		console.log('Welcome to Mini Code');
	},
	/**
	 * 收起/展开事件
	 */
	toggleSwitch(e) {
		var that = this;

		//get语法1。。。
		let { id } = e.currentTarget;
		let { list } = this.data;

		//登录检测
		if (id != list[0].type) {
			let { hasToken } = this.data;
			if (!hasToken) {
				that.toPage();
				return;
			}
		}

		//设置收起/展开状态
		list.forEach((item) => {
			item.open = item.type === id ? !item.open : false;
		});
		this.setData({
			list
		});

		//加载数据
		that.getPairList(id);
	},
	/**
	 * onShow
	 */
	onShow: function () {
		var that = this;

		//登录检测
		var token = tt.getStorageSync('token');
		var hasToken = token == "" || token == null ? false : true;
		that.setData({
			hasToken: hasToken,
			user: tt.getStorageSync('user')
		});

		//设置默认展开
		/*
		let {list} = this.data;
		list.forEach((item) => {
			item.open = false;
		});
		if(hasToken){
			list[0].open = true;
		}else{
			list[1].open = true;
		}
		this.setData({
            list
        });
		*/

		//获取匹配列表
		that.getPairList(3);
	},
	/**
	 * 页面跳转
	 */
	toPage: function () {
		tt.navigateTo({
			url: '/pages/login/login?page=/pages/index/index'
		});
	},
	/**
	 * 获取匹配列表
	 */
	getPairList: function (type) {
		var that = this;
		var url = app.globalData.url + "/pair/list";
		var data = {
			current: 1,
			size: 3,
			type: type
		}
		app.request("GET", url, data,
			(res) => {
				let {list} = that.data;
				list.forEach((item) => {
					if (item.type == type) {
						item.pageData = res.data.data.pageData;
					}
				});
				this.setData({
					list
				});
			}
		);
	}
})
