const config = require('../../config')
var sliderWidth = 48; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["全部", "SSR", "SR", "R", "N", "阴阳师"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    hina:'この腕\<view class="hina">うで\</view>を切<view class="hina">き</view>られた',
  },
  getUser: function (e) {
      wx.getUserInfo({
          success: function (res) {
              console.log(res)
          },
          fail: function (err) {
              console.log(err)
          }
      })
  },
    onLoad: function () {
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

        wx.login({
            success: function (res) {
                if (res.code) {
                    var url = config.loginApi + res.code
                    console.log(url)

                    wx.request({
                        url: url,
                        success: function (res) {
                            console.log(res)
                            console.log("===")
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });

        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                console.log("--------")
                console.log(res)
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            that.getUser();
                        }
                    })
                }else {
                    that.getUser();
                }
            }
        })

        //查询阴阳师list
        wx.request({
            url: config.service.qListUrl,
            method: 'POST',
            data: { cate: 'y' },
            success: function (res) {
                var _list = res.data.data
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


    tabClick: function (e) {
        //console.log(e.currentTarget)
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
});