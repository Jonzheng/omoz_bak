const Conf = require('../../config')
const App = new getApp()
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

const audioContextOri = wx.createInnerAudioContext()
audioContextOri.autoplay = false

const audioContextMine = wx.createInnerAudioContext()
audioContextMine.autoplay = false


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
        loged: false,
        slider: 'bar-ori',
        recordBar: 'record-bar',
        barWidth: -2,
        anRecord: '',
        oriPlaying: false,
        _style: 'width:0rpx;',
        isWifi: false,
        listenStatus: 'listen-off',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        list_master: [
            { mid: 4, pen: 666, icon_master: "../../image/master4.png", isListen: false },
            { mid: 2, pen: 233, icon_master: "../../image/master2.png", isListen: false },
            { mid: 0, pen: 99, icon_master: "../../image/master0.png", isListen: false },
            { mid: 1, pen: 9, icon_master: "../../image/master1.png", isListen: false },
            { mid: 3, pen: 3, icon_master: "../../image/master3.png", isListen: false },
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
        tempFile: ''
    },


    onReady: function (res) {
        audioContextOri.onPlay(() => {
            this.setData({
                slider: 'bar-end',
                oriPlaying: true,
            });
        });

        audioContextOri.onEnded(() => {
            this.setOriStop();
        });

        audioContextOri.onStop(() => {
            this.setOriStop();
        });

        audioContextMine.onEnded(() => {
            this.setMineStop();
        });

        audioContextMine.onStop(() => {
            this.setMineStop();
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

    //弃用
    tologin: function (e) {
        if(e.detail.userInfo){
            App.globalData.hasLogin = true
            this.setData({
                loged: true,
            })
            console.log(e.detail.userInfo)
        }else{
            App.globalData.hasLogin = false
            this.setData({
                loged: false,
            })
            console.log(e.detail.userInfo)
        }
    },
    //卍解-coin-1?
    unlock: function(){
        console.log("unlock")
        this.setData({
            isWifi:true
        })
    },

    onLoad: function (option) {
        //页面初始参数
        var that = this
        //console.log(option)
        //console.log(App.globalData.hasLogin)
        this.setData({
            loged:App.globalData.hasLogin,
            file_id: option['file_id'],
            title: option['title'],
            serifu: option['serifu'],
            src_image: option['src_image'],
            src_video: option['src_video'],
            koner: option['koner'],
            roma: option['roma'],
        })

        //查询t_audio
        wx.request({
            url: Conf.qAudioUrl,
            method: 'POST',
            data: {
                file_id: option['file_id'],
            },
            success: function (res) {
                var _list = res.data.data
                //console.log(_list)
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

    setOriStop: function(){
        this.setData({
            slider: 'bar-ori',
            oriPlaying: false,
        });
    },

    setMineStop: function () {
        this.setData({
            isPlaying: false,
            isPlayed: true
        })
    },

    playOri: function(e) {
        var ele_au = this.data.ele_audio
        audioContextOri.src = ele_au.src_audio
        audioContextOri.play()
    },

    stopOri: function (e) {
        audioContextOri.stop()
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
        this.stopOri()
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
        var tempFile = this.data.tempFile
        if (tempFile != undefined) {
            console.log(tempFile.tempFilePath)
            audioContextMine.src = tempFile.tempFilePath
            audioContextMine.play()
            this.setData({
                isPlaying: true,
                recordFile: tempFile.tempFilePath
            })
        }
    },

    stopMyVoice: function (e) {
        audioContextMine.stop()
    },

    listen: function(){
        var listenStatus = this.data.listenStatus
        if(listenStatus == 'listen-on'){
            listenStatus = 'listen-off'
        }else{
            listenStatus = 'listen-on'
        }
        console.log(listenStatus)
        this.setData({
            listenStatus: listenStatus
        }) 
    },

    uploadRecord: function (e) {
        var that = this
        var recordFile = this.data.recordFile
        console.log(recordFile)

        var mine = { mid: 4, pen: 666, icon_master: "../../image/master4.png", isListen: false }
        var old_lst = this.data.list_master
        old_lst.unshift(mine)
        this.setData({
            list_master: old_lst
        })
        wx.uploadFile({
            url: Conf.upRecordUrl,
            filePath: recordFile,
            name: 'file',
            formData: {
                file_id: that.data.file_id,
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

})