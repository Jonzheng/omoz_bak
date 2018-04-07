const recorderManager = wx.getRecorderManager()
const options = {
    duration: 10000,
    sampleRate: 48000,
    numberOfChannels: 2,
    encodeBitRate: 320000,
    format: 'mp3'
}

const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = false
innerAudioContext.onPlay(() => {
    console.log('onPlay')
})

innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
})

function _next() {
    var that = this;
    var _progress = this.data.progress_record
    if(!this.data.isRecording) {
        return true;
    }
    if (_progress >= 100){
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
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('myVideo')
    },
    videoErrorCallback: function(e) {
        console.log('视频错误信息:')
        
        console.log(e.detail.errMsg)
    },
    data: {
        src_vd:"",
        list_master:[
            { mid:1, pen: 666, comment: 66, icon_master: "../../image/master1.png", isListen: false },
            { mid:2, pen: 233, comment: 22, icon_master: "../../image/master2.png", isListen: false },
            { mid:3, pen: 99, comment: 36, icon_master: "../../image/master3.png", isListen: false },
            { mid:4, pen: 9, comment: 6, icon_master: "../../image/master4.png", isListen: false },
            { mid:0, pen: 3, comment: 1, icon_master: "../../image/master0.png", isListen: false },
        ],
        icon_play:"../../image/play.png",
        icon_stop: "../../image/stop.png",
        icon_upload: "../../image/upload.png",
        icon_record: "../../image/record.png",
        icon_like:"../../image/like.png",
        icon_comment:"../../image/comment.png",
        icon_more: "../../image/more.png",
        progress_record:0,
        hasTmp:false,
        isRecording:false,
        isPlaying: false,
        current: {
            poster: '',
            name: '何か困ったことでも',
            author: 'na ni ka ko ma tta ko to de mo',
            src: '',
        },
        audioAction: {
            method: 'pause'
        },
    },

    playFoo: function (e) {
        var ch = this.data.list_master
        var dataset = e.currentTarget["dataset"]
        var idx = dataset["idx"]
        ch[idx]["isListen"] = !ch[idx]["isListen"]
        this.setData({
            list_master:ch
        })
        console.log(ch[idx])
    },
    //录音

    startRecord: function (e) {
        if (this.data.isPlaying){
            this.stopMyVoice()
        }
        recorderManager.start(options)
        recorderManager.onStart(() => {
            console.log('start,dura:' + options.duration / 1000)
            this.setData({
                isRecording:true,
                progress_record:0,
                dura: options.duration / 1000,
                isPlayed: false
            })
            _next.call(this);
        })

        recorderManager.onStop((res) => {
            console.log(res)
            this.setData({
                tempFile: res,
                isRecording: false,
                hasTmp: true
            })
        })
    },

    stopRecord: function (e) {
        console.log('stop r')
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
        if (tempFile != undefined) {
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
            isPlayed:true
        })
    },
})