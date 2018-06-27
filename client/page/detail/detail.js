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

const audioContextMaster = wx.createInnerAudioContext()
audioContextMaster.autoplay = false

const audioContextMine = wx.createInnerAudioContext()
audioContextMine.autoplay = false

const load_list = [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.9, 4.1, 4.3]
//const downloadTask = wx.downloadFile({
//    url: src_sound,
//    success: function (res) {
//        console.log(res)
//    }
//})

const src_heart = "../../image/heart.png"
const src_heart_full = "../../image/heart_full.png"

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
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        list_master:[],
        record_map:{},
        icon_play: "../../image/play.png",
        icon_stop: "../../image/stop.png",
        icon_upload: "../../image/upload.png",
        icon_record: "../../image/record.png",
        icon_comment: "../../image/comment.png",
        icon_more: "../../image/more.png",
        progress_record: 0,
        hasTmp: false,
        myFalse: false,
        isRecording: false,
        isPlaying: false,
        tempFile: ''
    },
    onUnload: function () {
        console.log("onUnload")
        audioContextOri.stop()
        audioContextMine.stop()
        audioContextMaster.stop()
    },
    onReady: function (res) {
        this.videoContext = wx.createVideoContext('myVideo')

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

        audioContextMaster.onEnded(() => {
            this.setMasterStop();
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

    toLogin: function (e) {
        var that = this
        var userInfo = e.detail.userInfo
        console.log("toLogin:")
        if(userInfo){
            App.globalData.hasLogin = true
            App.globalData.userInfo = userInfo
            App.globalData.nickName = userInfo.nickName
            App.globalData.avatarUrl = userInfo.avatarUrl
            var gender = 1
            if (userInfo.gender != "" || userInfo.gender != undefined) gender = userInfo.gender
            App.globalData.gender = gender
            this.setData({
                loged: true,
            })
            console.log(userInfo)
            that.updateUser(userInfo)
        }else{
            App.globalData.hasLogin = false
            this.setData({
                loged: false,
            })
            console.log(userInfo)
        }
    },
    //卍解-coin-1?
    unlock: function(){
        console.log("unlock")
        this.setData({
            isWifi:true
        })
    },
    //更新用户到数据库
    updateUser: (userInfo) => {
        var openid = App.globalData.openid
        var nickName = App.globalData.nickName
        var avatarUrl = App.globalData.avatarUrl
        var gender = App.globalData.gender
        wx.request({
            url: Conf.updateUserUrl,
            method: 'POST',
            data: {
                openid,
                nickName,
                avatarUrl,
                gender,
            },
            success: function (res) {
                console.log('updateUser:')
                console.log(res)
            },
            fail: (res) => {
                console.log('fail:')
                console.log(res)
            }
        });
    },

    initPageData: function (file_id) {
        var that = this
        var openid = App.globalData.openid
        var user_id = openid
        //查询阴阳师list
        wx.request({
            url: Conf.queryDetailUrl,
            method: 'POST',
            data: { cate: 'y', file_id, user_id},
            success: function (res) {
                console.log("initPageData:")
                console.log(res.data.data)
                var list_element = res.data.data.list_result[0]
                var audio_element = res.data.data.audio_result[0]
                var record_result = res.data.data.record_result[0]
                console.log(record_result)
                for (let record of record_result) {
                    record["listenStatus"] = "listen-off"
                    record["boxStyle"] = "btn-play-box"
                    record["btnDelStyle"] = "btn-red-hidden"
                    record["btnPoiStyle"] = "btn-red-hidden"
                    record["btnRt"] = ""
                    if (record.heart_ud){
                        record["heartShape"] = src_heart_full
                        record["heartStatus"] = 1
                    }else{
                        record["heartShape"] = src_heart
                        record["heartStatus"] = 0
                    }
                    
                    record["isListen"] = false
                    console.log(record)
                }
                var shadow = audio_element.shadow.split(",").map((item) => { return item + 'rpx' })
                var video_size = list_element.video_size / 1048576
                that.setData({
                    list_element,
                    audio_element,
                    list_master:record_result,
                    video_size: video_size.toFixed(2),
                    shadow
                })
                //console.log(list_element)
                //console.log(audio_element)
                //console.log(shadow)
            }
        })
    },

    onLoad: function (option) {
        //页面初始参数
        var that = this
        //console.log(option)
        //console.log(App.globalData.hasLogin)
        var file_id = option['file_id']
        this.initPageData(file_id)
        this.setData({
            file_id,
            loged:App.globalData.hasLogin,
        })
    },

    videoWaiting: function () {
        var that = this
        console.log("waiting...")
        that.videoContext.pause()
        that.setData({ videoWait: false })
        setTimeout(function () {
            that.videoContext.play()
            that.setData({ videoWait: false })
        },200)
    },
    videoPlay: function () {
        console.log("Play...")
        if (this.data.videoWait){
            this.videoContext.pause()
        }
    },

    setOriStop: function(){
        this.setData({
            slider: 'bar-ori',
            oriPlaying: false,
        });
    },

    setMasterStop: function () {
        var index = this.data.listenIndex
        //console.log("setMasterStop:", index)
        var list_master = this.data.list_master
        if (index != null && list_master[index]["isListen"]) {
            list_master[index]["isListen"] = false
            list_master[index]["listenStatus"] = "listen-off"
            list_master[index]["anListen"] = ""
            audioContextMaster.stop()
            this.setData({
                list_master,
                listenIndex:null
            }) 
        }
    },

    setMineStop: function () {
        this.setData({
            isPlaying: false,
            isPlayed: true
        })
    },

    playOri: function(e) {
        var audio_element = this.data.audio_element
        audioContextOri.src = audio_element.src_audio
        audioContextOri.play()
    },

    stopOri: function (e) {
        audioContextOri.stop()
    },

    showMore: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        var index = currData.idx
        var list_master = this.data.list_master
        var master_id = list_master[index]["master_id"]
        var isSelf = false
        if (master_id == App.globalData.openid) isSelf = true
        //console.log(isSelf)
        //console.log(list_master[index])
        if (list_master[index]["btnRt"] == "rt-90"){
            list_master[index]["boxStyle"] = "btn-play-box"
            list_master[index]["btnRt"] = ""
            if(isSelf){
                list_master[index]["btnDelStyle"] = "btn-red-hidden"
            }else{
                list_master[index]["btnPoiStyle"] = "btn-red-hidden"
            }
        }else{
            list_master[index]["boxStyle"] = "btn-play-box-sm"
            list_master[index]["btnRt"] = "rt-90"
            if (isSelf) {
                list_master[index]["btnDelStyle"] = "btn-red"
            } else {
                list_master[index]["btnPoiStyle"] = "btn-red"
            }
        }
        that.setData({
            list_master
        }) 
    },

    //弃用
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

    delMine: function (record_id){
        wx.request({
            url: Conf.updateRecordUrl,
            method: 'POST',
            data: {
                record_id,
                status:0
            },
            success: function (res) {
                console.log('updateRecord:')
                console.log(res)
            },
            fail: (res) => {
                console.log('updateRecord.fail:')
                console.log(res)
            }
        });
    },

    delConfirm: function (e) {
        var that = this
        var currData = e.currentTarget.dataset
        var record_id = currData.record_id
        var index = currData.idx
        wx.showModal({
            title: '删除?',
            content: '不可逆操作,最后的判断',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                //console.log(res);
                if (res.confirm) {
                    var list_master = that.data.list_master
                    list_master.splice(index, 1)
                    that.setData({list_master})
                    that.delMine(record_id)
                } else {
                    //console.log('用户点击辅助操作')
                }
            }
        });
    },

    listen: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        var record_id = currData.record_id
        var index = currData.idx
        var list_master = this.data.list_master
        var src_record = list_master[index]["src_record"]
        if (!src_record) return
        if (list_master[index]["isListen"]){
            list_master[index]["isListen"] = false
            list_master[index]["listenStatus"] = "listen-off"
            list_master[index]["anListen"] = ""
            audioContextMaster.stop()
        }else{
            that.setMasterStop()
            list_master[index]["isListen"] = true
            list_master[index]["listenStatus"] = "listen-on"
            list_master[index]["anListen"] = "an-listen-on"
            console.log(index,src_record)
            audioContextMaster.src = src_record
            that.setData({
                listenIndex: index
            })
            audioContextMaster.play()
        }
        this.setData({
            list_master
        }) 
    },

    //--点心--
    updateHeart: function(e){
        var that = this
        var currData = e.currentTarget.dataset
        var status = currData.status
        var url = ""
        var index = currData.idx
        var list_master = this.data.list_master
        var curr_master = list_master[index]
        if (status == 0) {
            url = Conf.updateHeartUrl
            curr_master["heartShape"] = src_heart_full
            curr_master["heartStatus"] = 1
            curr_master["heart"] += 1
        } else {
            url = Conf.cancelHeartUrl
            curr_master["heartShape"] = src_heart
            curr_master["heartStatus"] = 0
            curr_master["heart"] -= 1
        }
        console.log(curr_master)
        var record_id = curr_master["record_id"]
        var master_id = curr_master["master_id"]
        var file_id = curr_master["file_id"]
        var openid = App.globalData.openid
        var user_id = openid
        wx.request({
            url: url,
            method: 'POST',
            data: {
                record_id,
                master_id,
                file_id,
                user_id
            },
            success: function (res) {
                console.log('updateHeart:')
                console.log(res)
                that.setData({
                    list_master
                })
            },
            fail: (res) => {
                console.log('updateHeart fail:')
                console.log(res)
            }
        });
    },

    uploadRecord: function (e) {
        var that = this
        var recordFile = this.data.recordFile
        console.log("recordFile:")
        console.log(recordFile)
        console.log("App.globalData.userInfo:")

        var openid = App.globalData.openid
        var file_id = this.data.file_id
        var userInfo = App.globalData.userInfo
        var nickName
        var avatarUrl
        if (userInfo){
            nickName = userInfo.nickName
            avatarUrl = userInfo.avatarUrl
        }
        console.log(userInfo)
        console.log("data:")
        console.log(this.data)

        var mine = {
            heart: 1,
            nick_name: nickName,
            avatar_url: avatarUrl,
            listenStatus: "listen-off",
            boxStyle : "btn-play-box",
            btnDelStyle : "btn-red-hidden",
            btnPoiStyle : "btn-red-hidden",
            heartShape : src_heart,
            heartStatus : 0,
            master_id: openid,
            isListen : false,
            isLoading: load_list
        }
        var old_lst = this.data.list_master
        old_lst.unshift(mine)
        this.setData({
            list_master: old_lst
        })
        wx.uploadFile({
            url: Conf.uploadRecordUrl,
            filePath: recordFile,
            name: 'file',
            formData: {
                file_id: file_id,
                openid: openid,
            },
            header: {
                'content-type': 'multipart/form-data'
            },
            success: function (res) {
                console.log('success')
                var jsonData = JSON.parse(res.data)
                var src_record = jsonData.data.src_record
                var list_master = that.data.list_master
                list_master[0]["isLoading"] = []
                list_master[0]["src_record"] = src_record
                that.setData({
                    list_master
                })
                console.log(list_master[0])
            },

            fail: function (e) {
                console.log('fail')
            }
        })
    },

})