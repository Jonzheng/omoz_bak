const config = require('../../config')

Page({
    data: {
        src_video: '',
        src_audio: '',
        c_name: 'none',
        level: 'ssr',
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
                console.log(res)
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
                that.setData({
                    src_audio: res.tempFilePaths[0]
                })
            }
        })
    },
    bindKeyInput: function (e) {
        this.setData({
            c_name: e.detail.value
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
        var file_id = this.data.level + '_' + this.data.c_name + '_' + this.data.ski + '_' + this.data.ver
        // 上传
        wx.uploadFile({
            url: config.service.upVideoUrl,
            filePath: that.data.src_video,
            name: 'file',
            formData: {
                file_id: file_id,
            },
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                console.log('success')
                console.log(res)
                //that.uploadAudio();
            },

            fail: function (e) {
                console.log('fail')
            }
        })
    },
    uploadAudio: function() {
        var that = this
        var src_audio = this.data.src_audio
        wx.uploadFile({
            url: config.service.upAudioUrl,
            filePath: src_audio,
            name: 'file',
            formData: {
                file_id: that.data.file_id,
                level: that.data.level,
                ski:that.data.ski,
                ver:that.data.ver,
                c_name:that.data.c_name
            },
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                console.log('success')
                console.log(res)
            },

            fail: function (e) {
                console.log('fail')
            }
        })
    }

})
