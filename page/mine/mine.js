
const app = getApp()
Page({

  data: {

      icon_coin:"../../image/coin.png",
      icon_avatar:"",
      nickname:"",
      level:0,
      act:false
  },
  onclick:function(e){
      var user_info = app.globalData["userInfo"]
      console.log(user_info)
      this.setData({
          act:!this.data.act,
          icon_avatar: user_info["avatarUrl"],
          nickname: user_info["nickName"]
      })
  }
})