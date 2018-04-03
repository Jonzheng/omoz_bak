const recorderManager = wx.getRecorderManager()
const options = {
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 1,
    encodeBitRate: 320000,
    format: 'mp3',
    frameSize: 0.1
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
    if (!this.data.isRecording) {
        return true;
    }
    this.setData({
        progress_record: this.data.progress_record + 1
    });
    setTimeout(function () {
        _next.call(that);
    }, 100);
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
            { pen: 666, comment: 66, icon_master: "../../image/master1.png" },
            { pen: 233, comment: 22, icon_master: "../../image/master2.png" },
            { pen: 99, comment: 36, icon_master: "../../image/master3.png" },
            { pen: 9, comment: 6, icon_master: "../../image/master4.png" },
            { pen: 3, comment: 1, icon_master: "../../image/master0.png" }
        ],
        icon_sound:"../../image/sound_1.png",
        icon_play:"../../image/play.png",
        icon_stop: "../../image/stop.png",
        icon_upload: "../../image/plus.png",
        icon_record: "../../image/record.png",
        progress_record:0,
        progress_record_static: 0,
        isStatic:true,
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

    //录音

    startRecord: function (e) {
        recorderManager.start(options)

        recorderManager.onStart(() => {
            console.log('recorder start')
            this.setData({
                isRecording:true,
                progress_record:0,
                isStatic:false
            })
            _next.call(this);
        })

        recorderManager.onFrameRecorded((res) => {
            console.log(2222)
            console.log(res)
        })

        recorderManager.onStop((res) => {
            this.setData({
                tempFile: res,
                isRecording: false,
                isStatic: true,
                progress_record_static: this.data.progress_record,
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
        console.log('play r')
        var tempFile = this.data.tempFile
        if (tempFile != undefined) {
            innerAudioContext.src = tempFile.tempFilePath
            innerAudioContext.play()
            this.setData({
                isPlaying: true
            })
            console.log('played')
        }
    },

    stopMyVoice: function (e) {
        console.log('stop voice')
        innerAudioContext.stop()
        this.setData({
            isPlaying: false
        })
    },
})