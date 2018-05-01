const audioCtx = new AudioContext();

const recorderManager = wx.getRecorderManager()
const options = {
    duration: 10000,
    sampleRate: 44100,
    numberOfChannels: 2,
    encodeBitRate: 320000,
    format: 'mp3',
    frameSize: 50
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


const src_sound = 'https://omoz-1256378396.cos.ap-guangzhou.myqcloud.com/audio/sr_thy_0_0.MP3'

const downloadTask = wx.downloadFile({
    url: src_sound,
    success: function (res) {
        console.log(res)
    }
})


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
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('myVideo')
    },
    onLoad: function (option) {
        console.log(option)
        this.setData({
            file_id: option['file_id']
        })
    },

    load_src: function(e) {
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
                        if (count == 360){
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
                        dataArray.forEach(function(v){
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


                    //while (true){
                    //    
                    //}


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

        //innerAudioContext.src = src_sound
        //innerAudioContext.play()
    },

    data: {
        src_vd: "https://test-1256378396.cos.ap-guangzhou.myqcloud.com/video/sr_br_0_0.MP4",
        list_master: [
            { mid: 1, pen: 666, comment: 66, icon_master: "../../image/master1.png", isListen: false },
            { mid: 2, pen: 233, comment: 22, icon_master: "../../image/master2.png", isListen: false },
            { mid: 3, pen: 99, comment: 36, icon_master: "../../image/master3.png", isListen: false },
            { mid: 4, pen: 9, comment: 6, icon_master: "../../image/master4.png", isListen: false },
            { mid: 0, pen: 3, comment: 1, icon_master: "../../image/master0.png", isListen: false },
        ],
        list_ori:[10,12,15],
        icon_play: "../../image/play.png",
        icon_stop: "../../image/stop.png",
        icon_upload: "../../image/upload.png",
        icon_record: "../../image/record.png",
        icon_like: "../../image/like.png",
        icon_comment: "../../image/comment.png",
        icon_more: "../../image/more.png",
        progress_record: 0,
        hasTmp: false,
        isRecording: false,
        isPlaying: false,
        tempFile:'',
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
        recorderManager.onStart(() => {
            console.log('start,dura:' + options.duration / 1000)
            this.setData({
                isRecording: true,
                progress_record: 0,
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