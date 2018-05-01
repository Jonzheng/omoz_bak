const config = require('../../config')
const ski_dict = {'0':'触碰','1':'技能1','2':'技能2','3':'技能3'}
Page({
    data: {
        full:false,

    },

    onLoad: function (option) {
        console.log(option)
        this.setData({
            file_id: option['file_id'],
            src_audio: option['src_path'],
            cate: option['cate'],
            level: option['level'],
            c_name: option['c_name'],
            title: option['c_name'] + '_' + ski_dict[option['ski']]
        })
    },

    chooseImage: function () {
        var that = this
        that.setData({
            src_image: ''
        })
        wx.chooseImage({
            count: 1,
            success: function (res) {
                console.log(res)
                that.setData({
                    src_image: res.tempFilePaths[0]
                })
            }
        })
    },

    titleInput: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    serifuInput: function (e) {
        this.setData({
            serifu: e.detail.value
        })
    },
    romaInput: function (e) {
        this.setData({
            roma: e.detail.value
        })
    },
    konerInput: function (e) {
        this.setData({
            koner: e.detail.value
        })
    },

    push: function () {
        var that = this
        var src_image = that.data.src_image
        console.log(this)
        wx.uploadFile({
            url: config.service.inListUrl,
            filePath: src_image,
            name: 'file',
            formData: {
                file_id: that.data.file_id,
                title: that.data.title,
                serifu: that.data.serifu,
                koner: that.data.koner,
                roma: that.data.roma,
                src_image: src_image,
                level: that.data.level,
                cate: that.data.cate
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
    }

})
