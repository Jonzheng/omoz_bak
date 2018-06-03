
const App = getApp()

Page({

    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
        console.log("click.")
    },
    point: function (e) {
        //var au = new AudioContext();
        //console.log(au)
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
    },

    black: function() {
        console.log("to black")
        console.log(this.data.userInfo)
        //wx.navigateTo({ url: '../b_index/index' })
    },

    onLoad: function () {
        console.log("onLoad")
        var userInfo = App.globalData.userInfo
        if(userInfo){
            this.setData({
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl
            })
        }
    },
    onReady: function () {
        console.log("onReady")
    },
})