App({
  //设置全局请求URL
  globalData:{
    url:'http://192.168.1.76:8058',
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
  },
  //上传文件
  upload(url, filePath, success){
    var task=tt.uploadFile({
      url: url,
      filePath: filePath,
      name: 'multipartFile',
      header: {
        'token': tt.getStorageSync('token')
      },
      success: function(res) {
        res.data = JSON.parse(res.data);
        tt.hideLoading();
        console.log('上传结果 -> ');
        console.log(res);
        if(res.data.code == 0){
          tt.showToast({
            title: '上传成功',
            icon: 'success'        
          })
          success(res);
				}else{
          console.log('上传失败 -> ' +res.data.msg);
          console.log(res);
					tt.showToast({
						title: res.data.msg,
						icon: 'fail'
					});
				}
      },
      fail: function({errMsg}) {
        tt.hideLoading();
        tt.showToast({
          icon: 'none',
          title: '上传失败'
        })
      }
    });
    //上传进度
    task.onProgressUpdate(res => {
      tt.showLoading({
        title: '上传中' + res.progress + '%'
      });
    });
  }
})
