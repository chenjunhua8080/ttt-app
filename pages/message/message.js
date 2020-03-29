// pages/message/message.js
const app = getApp()
const util = require("../../util/util.js")

Page({
	data: {
		pairList: null,
		pairListOpen: false,
		messageList: null,
	},
	/**
	 * onLoad
	 */
	onLoad: function (options) {

	},
	/**
	 * onShow
	 */
	onShow: function () {
		var that = this;

		//获取配对列表
		that.getPairList();
		//获取消息列表
		that.getMessageList(1);
	},
	/**
	 * 到底事件
	 */
	onReachBottom: function () {
		var that = this;
		var { current } = that.data.messageList;
		var { pages } = that.data.messageList;
		if (current != pages) {
			that.getMessageList(current + 1);
		} else {
			tt.showToast({
				title: '没有更多了',
				icon: 'none',
				duration: 500
			});
		}
	},
	/**
	   * 获取配对列表
	   */
	getPairList: function () {
		var that = this;
		var url = app.globalData.url + "/pair/getNewPairList";
		app.request("GET", url, null,
			(res) => {
				let { pairList } = that.data;
				pairList = res.data.data;
				this.setData({
					pairList
				});
				//没有新的添加时关闭
				if (pairList.length == 0) {
					let { pairListOpen } = that.data;
					if (pairListOpen) {
						pairListOpen = false;
						this.setData({
							pairListOpen
						});
					}
				}
			}
		);
	},
	/**
	 * 收起/展开事件
	 */
	toggleSwitch(e) {
		var that = this;

		//设置收起/展开状态
		var { pairListOpen } = that.data;
		pairListOpen = !pairListOpen;
		this.setData({
			pairListOpen
		});
	},
	/**
	 * 获取消息列表
	 */
	getMessageList: function (current) {
		var that = this;
		var url = app.globalData.url + "/msg/list";
		var data = {
			current: current,
			size: 10
		}
		app.request("GET", url, data,
			(res) => {
				let { messageList } = that.data;
				messageList = res.data.data;
				var today = util.format(new Date, 'yyyy-MM-dd');
				messageList.records.forEach((item) => {
					var date = item.lastTime;
					date = util.format(date, 'yyyy-MM-dd');
					if (today === date) {
						date = util.format(item.lastTime, 'HH:mm:ss');
					}
					item.lastTime = date;
				});
				this.setData({
					messageList
				});
			}
		);
	},
	/**
	 * 页面跳转
	 */
	toPage: function (e) {
		var that = this;
		var dataset = e.target.dataset;
		var page = dataset.page;
		var url;
		if (page === 'userInfo') {
			url = 'user/user?id=' + dataset.id;
		} else if (page === 'messageDetail') {
			var target = that.data.messageList.records[dataset.index];
			url = 'detail/detail?messageId=' + target.id
			+ '&targetId=' + target.targetId
			+ '&targetNickname=' + target.targetNickname
			+ '&targetAvatar=' + target.targetAvatar;
		}
		tt.navigateTo({
			url: url
		});
	}
})