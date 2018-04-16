//app.js
App({
    globalData: {
        userInfo: null,
        openId: '',
        ctxPath: 'https://xxxxxxx.org'
    },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            this.getUserInfo();
        }
      }
    })
  },
  //全局获取用户Openid，此方法可提供其他页面全局调用获取值
  getUserOpenid: function (cb) {
      if (this.globalData.openId) {
          typeof cb == "function" && cb(this.globalData.openId)
      } else {
          wx.login({  //获取用户登录状态
              success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId       
                  let code = res.code;
                  if (code) {
                      console.log('获取用户登录凭证：' + code);
                      //this.getOpenId(code,cb);
                      var that = this;
                      //发起网络请求,发起的是HTTPS请求，向服务端请求openid 
                      wx.request({
                          url: that.globalData.ctxPath + '/wxapp/checkWxBingding',
                          method: 'POST',
                          header: {
                              'content-type': 'application/x-www-form-urlencoded'
                          },
                          data: { 'code': code },
                          success: function (res) {
                              console.log(res);
                              that.globalData.openId = res.data.openid;
                              console.log("openId=" + that.globalData.openId);
                              typeof cb == "function" && cb(that.globalData.openId)
                          }
                      })
                  } else {
                      console.log('获取用户登录态失败：' + res.errMsg);
                  }
              }
          })
      }
  },
  //全局获取用户信息，此方法可提供其他页面全局调用获取值
  getUserInfo: function (cb) {
      var that = this
      if (this.globalData.userInfo) {
          typeof cb == "function" && cb(this.globalData.userInfo)
      } else {
          //获取微信用户信息
          wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                  }
              }
          })
      }
  },
  
})