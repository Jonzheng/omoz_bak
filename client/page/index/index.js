const Conf = require('../../config')
var sliderWidth = 48; // 需要设置slider的宽度，用于计算中间位置
const App = new getApp()
Page({
    data: {
        tabs: ["全部", "SSR", "SR", "R", "N", "阴阳师"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
    },
    
    //注册到数据库
    updateLogin: (js_code)=>{
        var avatarUrl
        if (App.globalData.userInfo) avatarUrl = App.globalData.userInfo.avatarUrl

        wx.request({
            url: Conf.updateLoginUrl,
            method: 'POST',
            data: {
                js_code,
                avatarUrl,
            },
            success: function (res) {
                console.log('updateLogin:')
                console.log(res)
                var openid = res.data.data
                App.globalData.openid = openid
            },
            fail: (res) => {
                console.log('fail:')
                console.log(res)
            }
        });
    },

    onLoad: function () {
        console.log("onLoad")
        var that = this;
        //初始化tabs
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                });
            }
        });

        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                console.log("getSetting:")
                console.log(res)
            }
        })

        //页面无提示
        wx.login({
            success: function (res) {
                console.log("login_success")
                if (res.code) {
                    var js_code = res.code
                    console.log(js_code)
                    //尝试获取用户信息
                    wx.getUserInfo({
                        success: function (res) {
                            console.log("getUserInfo-success")
                            App.globalData.hasLogin = true
                            console.log(res)
                            var userInfo = res.userInfo
                            App.globalData.userInfo = userInfo
                        },
                        fail: function (err) {
                            console.log("getUserInfo-fail")
                            App.globalData.hasLogin = false
                            console.log(err)
                        },
                        complete: function () {
                            that.updateLogin(js_code)
                        }
                    })

                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });

        //查询阴阳师list
        wx.request({
            url: Conf.qListUrl,
            method: 'POST',
            data: { cate: 'y' },
            success: function (res) {
                var _list = res.data.data
                _list.sort((a,b) => {return b.stars - a.stars})
                var ssr_list = []
                var sr_list = []
                var r_list = []
                var n_list = []
                var m_list = []
                _list.forEach(ele => {
                    if (ele.level == 'ssr'){
                        ssr_list.push(ele)
                    }
                    else if (ele.level == 'sr'){
                        sr_list.push(ele)
                    }
                    else if (ele.level == 'r') {
                        r_list.push(ele)
                    }
                    else if (ele.level == 'n') {
                        n_list.push(ele)
                    }
                    else if (ele.level == 'm') {
                        m_list.push(ele)
                    }
                })
                that.setData({
                    _list: _list,
                    ssr_list: ssr_list,
                    sr_list: sr_list,
                    r_list: r_list,
                    n_list: n_list,
                    m_list: m_list
                })
                console.log(_list)
            }
        })
    },
    onReady: function () {
        console.log("onReady")
    },

    tabClick: function (e) {
        //console.log(e.currentTarget)
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});