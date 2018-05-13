const config = require('../../config')
const recorderManager = wx.getRecorderManager()
const options = {
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 2,
    encodeBitRate: 320000,
    format: 'mp3',
    frameSize: 50
}
const dura = options.duration / 1000

const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false


innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
})


//const downloadTask = wx.downloadFile({
//    url: src_sound,
//    success: function (res) {
//        console.log(res)
//    }
//})


function _next() {
    var that = this;
    var _progress = this.data.progress_record
    if (!this.data.isRecording) {
        return true;
    }
    if (_progress >= 100) {
        _progress = 100;
        return true
    }
    this.setData({
        progress_record: _progress + 2
    });
    setTimeout(function () {
        _next.call(that);
    }, 200);
}

Page({
    data: {
        loged:false,
        slider: 'bar-ori',
        recordBar: 'record-bar',
        barWidth: -2,
        anRecord: '',
        _style: 'width:0rpx;',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        list_master: [
            { mid: 1, pen: 666, comment: 66, icon_master: "../../image/master1.png", isListen: false },
            { mid: 2, pen: 233, comment: 22, icon_master: "../../image/master2.png", isListen: false },
            { mid: 3, pen: 99, comment: 36, icon_master: "../../image/master3.png", isListen: false },
            { mid: 4, pen: 9, comment: 6, icon_master: "../../image/master4.png", isListen: false },
            { mid: 0, pen: 3, comment: 1, icon_master: "../../image/master0.png", isListen: false },
        ],
        list_ori: [10, 12, 15],
        icon_play: "../../image/play.png",
        icon_stop: "../../image/stop.png",
        icon_upload: "../../image/upload.png",
        icon_record: "../../image/record.png",
        icon_like: "../../image/like.png",
        icon_comment: "../../image/comment.png",
        icon_more: "../../image/more.png",
        progress_record: 0,
        hasTmp: false,
        myFalse: false,
        isRecording: false,
        isPlaying: false,
        tempFile: '',
        current: {
            poster: '',
            name: '何か困ったことでも',
            author: 'na ni ka ko ma tta ko to de mo',
            src: 'https://test-1256378396.cos.ap-guangzhou.myqcloud.com/sound/ssr_yml_0_0.mp3',
        },
        audioAction: {
            method: 'pause'
        },
    },


    onReady: function (res) {

        innerAudioContext.onPlay(() => {
            console.log('onPlay')
            this.setData({
                slider: 'bar-end'
            });
        });

        innerAudioContext.onEnded(() => {
            console.log('onEnded')
            this.setData({
                slider: 'bar-ori'
            });
        });

        //----监听录音------------
        recorderManager.onStart(() => {
            console.log('start,dura:' + dura)
            var anRecord = 'transition: all '+dura+'s linear;'
            this.setData({
                isRecording: true,
                progress_record: 0,
                dura: dura,
                barWidth: 0,
                _style: '',
                recordBar: 'record-bar-end',
                anRecord: anRecord,
                isPlayed: false
            })
            _next.call(this);
        })

        recorderManager.onStop((res) => {
            console.log(res)

            var barWidth = res.duration / options.duration * 100
            var anRecord = ''
            
            var _style= `width:${barWidth}rpx;`
            console.log(barWidth)
            this.setData({
                tempFile: res,
                barWidth,
                recordBar: 'record-bar',
                _style,
                anRecord,
                isRecording: false,
                hasTmp: true
            })
        })
    },

    setLoged: function(ed){
        this.setData({
            loged: ed,
        })
    },

    tologin: function (e) {
        if(e.detail.userInfo){
            this.setLoged(true)
            console.log(e.detail.userInfo)
        }else{
            this.setLoged(false)
            console.log(e.detail.userInfo)
        }
    },
    onLoad: function (option) {
        //页面初始参数
        var that = this
        console.log(option)
        this.setData({
            file_id: option['file_id'],
            title: option['title'],
            serifu: option['serifu'],
            src_image: option['src_image'],
            src_video: option['src_video'],
            koner: option['koner'],
            roma: option['roma'],
        })
        //尝试获取用户信息
        wx.getUserInfo({
            success: function (res) {
                that.setLoged(true)
                console.log(res)
            },
            fail: function (err) {
                that.setLoged(false)
                console.log(err)
            }
        })


        //查询t_audio
        wx.request({
            url: config.service.qAudioUrl,
            method: 'POST',
            data: {
                file_id: option['file_id'],
            },
            success: function (res) {
                var _list = res.data.data
                console.log(_list)
                let ele_audio = {}
                if (_list.length > 0) ele_audio = _list[0]
                var shadow = ele_audio.shadow.split(",").map((item) => { return item + 'rpx' })
                that.setData({
                    list_au: _list,
                    shadow,
                    ele_audio
                })
            }
        });
    },

    load_src: function(e) {
        var ele_au = this.data.ele_audio
        innerAudioContext.src = ele_au.src_audio
        innerAudioContext.play()
    },

    playFoo: function (e) {
        var ch = this.data.list_master
        var dataset = e.currentTarget["dataset"]
        var idx = dataset["idx"]
        ch[idx]["isListen"] = !ch[idx]["isListen"]
        this.setData({
            list_master: ch
        })
        console.log(ch[idx])
    },
    //录音

    startRecord: function (e) {
        if (this.data.isPlaying) {
            this.stopMyVoice()
        }
        recorderManager.start(options)
    },

    stopRecord: function (e) {
        console.log('stop r')
        console.log(recorderManager)
        recorderManager.stop()
        this.setData({
            isRecording: false,
        })
    },

    playMyVoice: function (e) {
        if (this.data.isRecording) {
            return false
        }
        console.log('play r')
        var tempFile = this.data.tempFile
        console.log(tempFile)
        if (tempFile != undefined) {
            //innerAudioContext.src = tempFile.tempFilePath
            console.log(tempFile.tempFilePath)
            innerAudioContext.src = tempFile.tempFilePath
            innerAudioContext.play()
            this.setData({
                isPlaying: true,
            })
            console.log('played')
        }
    },

    stopMyVoice: function (e) {
        console.log('stop voice')
        innerAudioContext.stop()
        this.setData({
            isPlaying: false,
            isPlayed: true
        })
    },
})