const config = require('../../config')

Page({
    data: {
        list_audio:[],
    },
    onLoad: function () {
        var that = this
        wx.request({
            url: config.service.qAudioUrl,
            method: 'POST',
            data: {
                cate: 'all',
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                var _list = res.data.data
                console.log(_list)
                that.setData({
                    list_audio: _list
                })
            }
        })
    },
    chooseImage: function () {
        var that = this
        that.setData({
            src_audio: ''
        })
        wx.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res)
                that.setData({
                    src_audio: res.tempFilePaths[0]
                })
            }
        })
    },

    edit: function(e) {
        let dataset = e.currentTarget.dataset
        let file_id = dataset['id']
        let src_path = dataset['src']
        let c_name = dataset['c_name']
        let ski = dataset['ski']
        let url = '../b_prepare/prepare?file_id=' + file_id + '&src_path=' + src_path + '&c_name=' + c_name + '&ski=' + ski
        wx.navigateTo({ url: url })
    }

})
