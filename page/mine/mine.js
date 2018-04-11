
const app = getApp()
Page({

    data: {
        taps:[],
        po_x:0,
        po_y:0,
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
    },
    point: function (e) {
        var au = new AudioContext();
        console.log(au)
        var that = this
        console.log(e.detail)
        var _taps = this.data.taps
        _taps.push(6)
        console.log(_taps)
        this.setData({
            po_x: e.detail["x"]-20,
            po_y: e.detail["y"]-90,
            taps: _taps
        })
    }
})