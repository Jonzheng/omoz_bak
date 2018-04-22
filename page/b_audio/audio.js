const config = require('../../config')

Page({
    data: {
        src_video: '',
        src_audio: '',
        c_name: '佚名',
        s_name: 'foo',
        level: 'ssr',
        cate: 'y',
        ski: '0',
        ver: '0'
    },

    chooseVideo: function () {
        var that = this
        that.setData({
            src_video: ''
        })
        wx.chooseVideo({
            success: function (res) {
                that.setData({
                    src_video: res.tempFilePath
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

    c_nameInput: function (e) {
        this.setData({
            c_name: e.detail.value
        })
    },

    s_nameInput: function (e) {
        this.setData({
            s_name: e.detail.value
        })
    },

    reChange: function (e) {
        this.setData({
            level: e.detail.value
        })
    },
    skChange: function (e) {
        this.setData({
            ski: e.detail.value
        })
    },
    vsChange: function (e) {
        this.setData({
            ver: e.detail.value
        })
    },

    upload: function() {
        var that = this
        console.log(this.data)
        var file_id = this.data.level + '_' + this.data.s_name + '_' + this.data.ski + '_' + this.data.ver
        // 上传
        wx.uploadFile({
            url: config.service.upAudioUrl,
            filePath: that.data.src_audio,
            name: 'file',
            formData: {
                file_id: file_id,
                level: that.data.level,
                cate: that.data.cate,
                ski: that.data.ski,
                ver: that.data.ver,
                c_name: that.data.c_name,
                s_name: that.data.s_name
            },
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                console.log('success')
                console.log(res)
                //that.uploadVideo();
            },

            fail: function (e) {
                console.log('fail')
            }
        })
    },
    uploadVideo: function() {
        console.log('up Video is comming soon')
    }

})
