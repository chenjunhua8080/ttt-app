App({
  //设置全局请求URL
  globalData:{
    url:'http://127.0.0.1:8058',
  },
  /**
  * 封装tt.request请求
  * method： 请求方式
  * url: 请求地址
  * data： 要传递的参数
  * success 请求成功回调函数
  * fail 请求失败回调函数
  * token: token值
  **/
  request(method, url, data, success) {
    tt.request({
      url: url,
      method: method,
      data: data,
      header: {
        'token': tt.getStorageSync('token')
      },
      dataType: 'json',
      success: function (res) {
        console.log('tt.request - >');
        console.log(res);
        if(res.data.code == 0){
          success(res);
				}else{
					tt.showToast({
						title: res.data.msg,
						icon: 'fail'
					});
				}
      },
      fail: function (res) {
        console.log('tt.request - >');
        console.log(res);
        tt.showToast({
					title: 'req fail',
          icon: 'fail'
				});
      }
    })
  }
})
