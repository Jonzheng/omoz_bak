const audioCtx = new AudioContext();
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

    playAudio: function(e){
        var th = this
        wx.request({
            url: 'https://omoz-1256378396.cos.ap-guangzhou.myqcloud.com/audio/sr_thy_0_0.MP3',
            responseType: 'arraybuffer',
            success: function (audioData) {
                console.log(audioData)
                audioCtx.decodeAudioData(audioData.data).then(function (decodedData) {
                    console.log('====')
                    console.log(decodedData)
                    var source = audioCtx.createBufferSource();
                    var analyser = audioCtx.createAnalyser();
                    source.buffer = decodedData
                    source.connect(analyser)
                    analyser.connect(audioCtx.destination);

                    analyser.fftSize = 128;
                    var bufferLength = analyser.frequencyBinCount;
                    var dataArray = new Uint8Array(bufferLength);
                    analyser.getByteFrequencyData(dataArray);
                    console.log('-----')

                    source.start()

                    var count = 0
                    var list_o = new Array()
                    var list_m = new Array()
                    function _render() {
                        var that = this
                        count += 1
                        if (count == 360) {
                            console.log(list_m)
                            console.log(list_o)
                            th.setData({
                                list_ori: list_o
                            })
                            return true
                        }
                        analyser.getByteTimeDomainData(dataArray);
                        //analyser.getByteFrequencyData(dataArray);
                        var sum = 0
                        dataArray.forEach(function (v) {
                            sum += v
                        })
                        //console.log(Math.abs(2048 - sum))
                        var h = Math.abs(8192 - sum) / 20
                        if (h < 2) h = 2
                        list_o.push(h)
                        var m = analyser.maxDecibels
                        list_m.push(m)
                        setTimeout(function () {
                            _render.call(that);
                        }, 20);
                    }
                    _render()

                    //function _render() {
                    //    var that = this
                    //    count += 1
                    //    console.log(source)
                    //    if (count == 20){
                    //        return true
                    //    }
                    //    dataArray = new Uint8Array(bufferLength);
                    //    analyser.getByteFrequencyData(dataArray);
                    //    //console.log(dataArray)
                    //    setTimeout(function () {
                    //        _render.call(that);
                    //    }, 200);
                    //}
                    //_render()
                });

            }
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
