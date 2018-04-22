
const ski_dict = {'0':'触碰','1':'技能1','2':'技能2','3':'技能3'}
Page({
    data: {

    },

    onLoad: function (option) {
        console.log(option)
        this.setData({
            file_id: option['file_id'],
            src_audio: option['src_path'],
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
        console.log(this.data)
    }

})
