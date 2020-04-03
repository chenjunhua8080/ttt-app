const app = getApp()
const util = require("../../util/util.js")

Page({
	data: {
		hasToken: false,
		user: {},
		loveWords: 'hello word',
		list: [
			{
				type: '3',
				name: '十万八千米以内',
				open: true,
				pageData: null
			}, {
				type: '1',
				name: '同年同月同日',
				pageData: null
			}, {
				type: '2',
				name: '不相上下',
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
			if (item.type == id) {
				item.open = !item.open
				//加载数据
				if (item.open) {
					that.getPairList(id);
				}
			} else {
				item.open = false;
			}
		});
		this.setData({
			list
		});
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

		//土味情话
		that.setData({
			loveWords: util.getLoveWords()
		})

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
				let { list } = that.data;
				list.forEach((item) => {
					if (item.type == type) {
						var pageData = res.data.data.pageData;
						var list = pageData.records;
						list.forEach((item) => {
							item.birthday = util.format(item.birthday, 'yyyy-MM-dd');
						});
						item.pageData = pageData;
					}
				});
				this.setData({
					list
				});
			}
		);
	}
})
